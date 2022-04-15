const mongoose = require("mongoose")
const Schema = mongoose.Schema

const statSchema = new Schema({
    initiated: {
        type: Boolean,
        default: false
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