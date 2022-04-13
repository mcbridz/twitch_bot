const express = require('express')
const https = require('https')
const convert = require('xml-js')

const router = express.Router()

router.get("/getStats", (req, res) => {
    console.log("getStats route activated")
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // https.get("https://steamcommunity.com/profiles/76561197965889025/stats/381210/?xml=1", response => {
    //     let data = []
    //     console.log('Status Code: ', response.statusCode)
    //     response.on('data', chunk => {
    //         data.push(chunk)
    //     })
    //     response.on('end', () => {
    //         console.log('Response ended')
    //         // console.log(data.join(''))
    //         xml_raw = data.join('')
    //         let result = JSON.parse(convert.xml2json(xml_raw, { compact: true }))
    //         // console.log(result)
    //         let recent_hours = result['playerstats']['stats']['hoursPlayed']['_text']
    //         res.status(200).send(recent_hours)
    //     })
    // })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})

module.exports = router