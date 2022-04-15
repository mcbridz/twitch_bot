const express = require('express')
const mongodb = require("mongodb")
const MongoUsername = process.env.MONGO_USERNAME || require('../secrets').mongo_username
const MongoPassword = process.env.MONGO_PASSWORD || require('../secrets').mongo_password
const path = require('path')

var app = express()

app.set('view engine', 'ejs')
// if (process.env.PORT) {
//     app.use(express.static(path.join(__dirname, "..", "client", "build")));
//   } else {
//     app.use(express.static("static"));
// }



app.get("/", (req, res) => {
    // res.status(200).send("Hello World!")
    console.log('bot connected')
    res.status(200).send("Hello, World!")
})



const getStats = require("./stats")
app.use("/", getStats)
const statControl = require("./statControl")
app.use("/", statControl)
const componentControl = require('./componentControl')
app.use("/", componentControl)
app.use(express.static(path.join(__dirname, 'static')))


module.exports = function (deps) {
    const mongoose = require('mongoose')
    const url = `mongodb+srv://${MongoUsername}:${MongoPassword}@cluster0.wjjai.mongodb.net/${deps.dbname}?retryWrites=true&w=majority`
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((res) => {
        console.log('Connected to Atlas db')
    })
    const server = require("http").createServer(app)
    setInterval(() => {
        console.log("PUH-PUH")
    }, 5000)
    return server
}