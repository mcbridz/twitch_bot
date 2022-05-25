const mongoose = require("mongoose")
const Schema = mongoose.Schema
const fetch = require('fetch')
const steam_key = process.env.STEAMKEY || require('../secrets').steam_key
const STEAMSTATS = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/'
const STEAMHOURS = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/'
const indexNames = ['DBD_UnhookOrHeal', 'DBD_DLC3_Camper_Stat1', 'DBD_GeneratorPct_float', 'DBD_Escape', 'DBD_SacrificedCampers', 'DBD_KilledCampers']

const statSchema = new Schema({
    initiated: {
        type: Boolean,
        default: false
    },
    ref: {
        type: String,
        required: false,
    },
    hours: {
        type: Number,
        required: true,
        default: 0
    },
    gensMonth: {
        type: Number,
        required: true,
        default: 0
    },
    totemsMonth: {
        type: Number,
        required: true,
        default: 0
    },
    savesMonth: {
        type: Number,
        required: true,
        default: 0
    },
    escapesMonth: {
        type: Number,
        required: true,
        default: 0
    },
    killsMonth: {
        type: Number,
        required: true,
        default: 0
    },
    gensDay: {
        type: Number,
        required: true,
        default: 0
    },
    totemsDay: {
        type: Number,
        required: true,
        default: 0
    },
    savesDay: {
        type: Number,
        required: true,
        default: 0
    },
    escapesDay: {
        type: Number,
        required: true,
        default: 0
    },
    killsDay: {
        type: Number,
        required: true,
        default: 0
    },
})



statSchema.methods.monthReset = async function () {
    this.gensMonth = 0
    this.totemsMonth = 0
    this.savesMonth = 0
    this.escapesMonth = 0
    this.killsMonth = 0
    return this.save()
}
statSchema.methods.dayReset = async function () {
    this.gensDay = 0
    this.totemsDay = 0
    this.savesDay = 0
    this.escapesDay = 0
    this.killsDay = 0
    return this.save()
}
statSchema.methods.upGens = async function (num) {
    let numR = !num ? 1 : num
    this.gensDay += numR
    this.gensMonth += numR
    return this.save()
}
statSchema.methods.upTotems = async function (num) {
    this.totemsDay += num
    this.totemsMonth += num
    return this.save()
}
statSchema.methods.upSaves = async function (num) {
    let numR = !num ? 1 : num
    this.savesDay += numR
    this.savesMonth += numR
    return this.save()
}
statSchema.methods.upEscapes = async function (num) {
    let numR = !num ? 1 : num
    this.escapesDay += numR
    this.escapesMonth += numR
    return this.save()
}
statSchema.methods.upKills = async function (num) {
    let numR = !num ? 1 : num
    this.killsDay += numR
    this.killsMonth += numR
    return this.save()
}
statSchema.methods.initi = async function (num) {
    let numR = !num ? 1 : num
    this.initiated = true
    return this.save()
}
statSchema.methods.updateHours = async function (num) {
    this.hours = num
    return this.save()
}



statSchema.statics.updateStats = async function () {
    Stats.find({ inititated: false, ref: 'day' }, async function (err, dayRef) {
        Stats.find({ initiated: true }, async function (err, liveStats) {
            Stats.find({ initiated: false, ref: 'ref' }, async function (err, monthStats) {

                const url = STEAMSTATS + '?' + new URLSearchParams({
                    key: steam_key,
                    format: 'json',
                    steamid: '76561197965889025',
                    appid: 381210
                })

                fetch.fetchUrl(url, async function (error, meta, body) {
                    // const data = JSON.parse(body.toString()).playerstats.stats
                    const data = JSON.parse(body.toString()).playerstats.stats
                    const pruned = data.filter(obj => indexNames.includes(obj.name))
                    // console.log(pruned)
                    const kills = pruned.filter(obj => obj.name === 'DBD_SacrificedCampers')[0].value
                    const moris = pruned.filter(obj => obj.name === 'DBD_KilledCampers')[0].value
                    const saves = pruned.filter(obj => obj.name === 'DBD_UnhookOrHeal')[0].value
                    const gens = pruned.filter(obj => obj.name === 'DBD_GeneratorPct_float')[0].value
                    const escapes = pruned.filter(obj => obj.name === 'DBD_Escape')[0].value
                    const totems = pruned.filter(obj => obj.name === 'DBD_DLC3_Camper_Stat1')[0].value

                    liveStats[0].killsDay = (kills + moris) - dayRef[0].killsDay
                    liveStats[0].savesDay = saves - dayRef[0].savesDay
                    liveStats[0].totemsDay = totems - dayRef[0].totemsDay
                    liveStats[0].gensDay = Math.round(gens) - dayRef[0].gensDay
                    liveStats[0].escapesDay = escapes - dayRef[0].escapesDay
    
                    liveStats[0].killsMonth = (kills + moris) - monthStats[0].killsMonth
                    liveStats[0].savesMonth = saves - monthStats[0].savesMonth
                    liveStats[0].totemsMonth = totems - monthStats[0].totemsMonth
                    liveStats[0].gensMonth = Math.round(gens) - monthStats[0].gensMonth
                    liveStats[0].escapesMonth = escapes - monthStats[0].escapesMonth

                })    
                const hours_url = STEAMHOURS + '?' + new URLSearchParams({
                    key: steam_key,
                    format: 'json',
                    steamid: '76561197965889025',
                })
                fetch.fetchUrl(hours_url, async function (error, meta, body) {
                    console.log(body.toString())
                    const data = JSON.parse(body.toString())
                    const specHours = data['response']['games'].filter((obj) => obj.appid === 381210)[0]
                    const totalHours = Math.round((specHours.playtime_forever * 100) / 60) / 100
                    await liveStats[0].updateHours(totalHours)
                    console.log(`new total hours: ${liveStats[0].hours}`)
                    // liveStats[0].markModified('hours')
                })
            })
            await liveStats[0].save(function (err) {
                if (err) {
                    console.log(err)
                }
            })
        })
    })
}
statSchema.statics.reset = async function () {
    Stats.find({ initiated: false, ref: 'ref' }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in reset back-end')
        }
        const url = STEAMSTATS + '?' + new URLSearchParams({
            key: steam_key,
            format: 'json',
            steamid: '76561197965889025',
            appid: 381210
        })
        fetch.fetchUrl(url, async function (error, meta, body) {
            // const data = JSON.parse(body.toString()).playerstats.stats
            const data = JSON.parse(body.toString()).playerstats.stats
            const pruned = data.filter(obj => indexNames.includes(obj.name))
            // console.log(pruned)
            const kills = pruned.filter(obj => obj.name === 'DBD_SacrificedCampers')[0].value
            const moris = pruned.filter(obj => obj.name === 'DBD_KilledCampers')[0].value
            const saves = pruned.filter(obj => obj.name === 'DBD_UnhookOrHeal')[0].value
            const gens = pruned.filter(obj => obj.name === 'DBD_GeneratorPct_float')[0].value
            const escapes = pruned.filter(obj => obj.name === 'DBD_Escape')[0].value
            const totems = pruned.filter(obj => obj.name === 'DBD_DLC3_Camper_Stat1')[0].value
            // console.log(dbStats)
            const deltaKills = (kills + moris) - dbStats[0].killsMonth
            const deltaSaves = saves - dbStats[0].savesMonth
            const deltaGens = Math.round(gens) - dbStats[0].gensMonth
            console.log(`Delta for gens is ${gens} - ${dbStats[0].gensMonth} = ${deltaGens}`)
            const deltaEscapes = Number(escapes) - Number(dbStats[0].escapesMonth)
            // console.log(`Delta for escapes is ${escapes} - ${Number(dbStats[0].escapesMonth)} = ${deltaEscapes}`)
            const deltaTotems = totems - dbStats[0].totemsMonth
            Stats.find({ initiated: true }, async function (err, liveStats) {
                if (err) {
                    console.log('An error has occurred in updateMonth back-end, second db fetch')
                }
                liveStats[0].killsMonth = deltaKills
                liveStats[0].savesMonth = deltaSaves
                liveStats[0].gensMonth = deltaGens
                liveStats[0].escapesMonth = deltaEscapes
                liveStats[0].totemsMonth = deltaTotems
                liveStats[0].killsDay = 0
                liveStats[0].savesDay = 0
                liveStats[0].gensDay = 0
                liveStats[0].escapesDay = 0
                liveStats[0].totemsDay = 0
                console.log(liveStats[0])
                await liveStats[0].save()
            })
            Stats.find({ initiated: false, ref: 'day' }, async function (err, dbStats3) {
                dbStats3[0].killsDay = kills + moris
                dbStats3[0].savesDay = saves
                dbStats3[0].gensDay = Math.round(gens)
                dbStats3[0].escapesDay = escapes
                dbStats3[0].totemsDay = totems
                await dbStats3[0].save()
            })
        })
    })
}
statSchema.statics.retrieve = function () {
    return this.find({ initiated: true })
}
statSchema.statics.create = async function () {
    const stats = new this()
    return stats.save()
}
statSchema.statics.destroy = async function () {
    return this.deleteMany({})
}

const Stats = mongoose.model("Stats", statSchema)
module.exports = { Stats }