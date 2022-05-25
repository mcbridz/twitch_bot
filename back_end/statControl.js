const express = require('express')
const mongoose = require('mongoose')
const fetch = require('fetch')
const router = express.Router()
const Stats = require('./statModels').Stats
const steam_key = process.env.STEAMKEY || require('../secrets').steam_key
const STEAMSTATS = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/'
const STEAMHOURS = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/'
const indexNames = ['DBD_UnhookOrHeal', 'DBD_DLC3_Camper_Stat1', 'DBD_GeneratorPct_float', 'DBD_Escape', 'DBD_SacrificedCampers', 'DBD_KilledCampers']

router.get("/create", async function (req, res) {
    // console.log("creating stat instance")
    newStats = await Stats.create()
    if (req.query.ref) {
        console.log('reference caught')
        newStats.ref = req.query.ref
    }
    await Stats.save()
    res.status(201).send("Stat instance created")
})
router.get("/initi", (req, res) => {
    Stats.find({ initiated: false }, async function (err, dbStats) {
        // console.log(dbStats[0].initi)
        if (err) {
            console.log('An error has occurred in init back-end')
            return
        }
        dbStats[0].initi()
        // console.log('Stats initiated')
        res.status(202).send('Stats initiated')
    })
})
router.get("/monthReset", function (req, res) {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in monthReset back-end')
        }
        await dbStats[0].monthReset()
    })
})
router.get("/dayReset", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in dayReset back-end')
        }
        await dbStats[0].dayReset()
    })
})
router.get("/gen", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        let num = !req.query.numberOf ? 1 : parseInt(req.query.numberOf)
        await dbStats[0].upGens(num)
    })
})
router.get("/totem", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        let num = !req.query.numberOf ? 1 : parseInt(req.query.numberOf)
        await dbStats[0].upTotems(num)
    })
})
router.get("/save", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        let num = !req.query.numberOf ? 1 : parseInt(req.query.numberOf)
        await dbStats[0].upSaves(num)
    })
})
router.get("/escape", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        await dbStats[0].upEscapes()
    })
})
router.get("/kill", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        let num = !req.query.numberOf ? 1 : parseInt(req.query.numberOf)
        await dbStats[0].upKills(num)
    })
})
router.get("/hours", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in hours back-end')
        }
        let num = req.query.hours
        await dbStats[0].updateHours(num)
    })
})
router.get("/createX", async function (req, res) {
    const newStats = await Stats.create()
    newStats.ref = 'ref'
    await newStats.save()
    console.log("created")
})
router.get("/reset", (req, res) => {
    Stats.reset()
    res.status(200).send('reset terminated normally')
})
router.get("/update", (req, res) => {
    Stats.updateStats()
    res.status(200).set('Content-Type', 'text/html').send('updated stats')
    
})
router.get("/setMonth", (req, res) => {
    Stats.find({ initiated: false, ref: 'ref' }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in setMonth back-end')
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
            dbStats[0].killsMonth = kills + moris
            dbStats[0].savesMonth = saves
            dbStats[0].gensMonth = Math.round(gens)
            dbStats[0].escapesMonth = escapes
            dbStats[0].totemsMonth = totems
            await dbStats[0].save()
            res.status(200).send('setMonth terminated normally')
        })
    })
})

module.exports = router