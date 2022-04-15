const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()
const Stats = require('./statModels').Stats

router.get("/create", async function (req, res) {
    // console.log("creating stat instance")
    await Stats.create()
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
        let num = !req.query.numberOf ? 1 : req.query.numberOf
        await dbStats[0].upGens(num)
    })
})
router.get("/totem", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        let num = !req.query.numberOf ? 1 : req.query.numberOf
        await dbStats[0].upTotems(num)
    })
})
router.get("/save", (req, res) => {
    Stats.find({ initiated: true }, async function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in kill back-end')
        }
        let num = !req.query.numberOf ? 1 : req.query.numberOf
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
        let num = !req.query.numberOf ? 1 : req.query.numberOf
        await dbStats[0].upKills(num)
    })
})

module.exports = router