const express = require('express')
const mongoose = require('mongoose')
const Stats = require('./statModels').Stats

const router = express.Router()


router.get("/marquee", async function (req, res) {
    Stats.find({ initiated: true }, function (err, dbStats) {
        if (err) {
            console.log('An error has occurred in getting Stats in marquee back-end')
            console.log(err)
        }
        res.render('../views/partials/marquee', {
            gensMonth: dbStats[0].gensMonth,
            totemsMonth: dbStats[0].totemsMonth,
            savesMonth: dbStats[0].savesMonth,
            escapesMonth: dbStats[0].escapesMonth,
            killsMonth: dbStats[0].killsMonth,
            hours: dbStats[0].hours,
            gensDay: dbStats[0].gensDay,
            totemsDay: dbStats[0].totemsDay,
            savesDay: dbStats[0].savesDay,
            escapesDay: dbStats[0].escapesDay,
            killsDay: dbStats[0].killsDay,
        })
    })
})

module.exports = router