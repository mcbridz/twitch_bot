const tmi = require('tmi.js')
const oAuth = process.env.TTV_OAUTH || require('./secrets').twitch_Oauth
const url = process.env.DBDSTATSURL || 'http://localhost:8000/'
const steam_key = process.env.STEAMKEY || require('./secrets').steam_key
const http = require('http')
const fetch = require('fetch')
const { json } = require('express/lib/response')


const regexCmd = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'Zaknefarious_bot',
        password: oAuth
    },
    channels: ['zaknefarious']
})

const addresses = {
    gen: `${url}gen`,
    totem: `${url}totem`,
    save: `${url}save`,
    escape: `${url}escape`,
    kill: `${url}kill`,
    dayReset: `${url}dayReset`,
    monthReset: `${url}monthReset`,
    init: `${url}initi`,
    create: `${url}create`,
    hours: `${url}hours`,
}
const externalAddresses = {    
    updateStats: 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/',
    updateHours: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/'
}

client.connect()
    .then(() => {
        console.log('bot connected')
        console.log(!process.env.DBDSTATSURL)
        if (!process.env.DBDSTATSURL) {
            http.get('http://localhost:8000/', res => {
                console.log('test get sent')
            })
        }
    }).catch((err) => {
        console.log('Error connecting')
        console.log(err)
    })

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`)
    if (self) return
    if (message.toLowerCase() === `!hello`) {
        client.say(channel, `@${tags.username}, hello, world!`)
    }
    var raw
    var command
    var argument
    !message.match(regexCmd) ? message_matches = [] : [raw, command, argument] = message.match(regexCmd)
    console.log(raw, command, argument)
    if (tags.username === 'zaknefarious' && message.toLowerCase() !== '!hello' && command in addresses) {
        // client.say(channel, `Command ${command} received`)
        let new_url = addresses[`${command}`]
        console.log(new_url)
        fetch.fetchUrl(new_url + (!argument ? '' : '?' + new URLSearchParams({
            numberOf: argument
        })), res => {
            console.log(res)
        })
    }
    if (command in externalAddresses) {
        console.log('command recognized')
        const address = externalAddresses[`${command}`]
        const specificCommand = command.slice(6)
        console.log('specific command: ' + specificCommand)
        console.log('Sending the following fetch request: ')
        const url = address + '?' + new URLSearchParams({
            key: steam_key,
            format: 'json',
            steamid: '76561197965889025'
        })
        console.log(url)
        if (specificCommand === 'Hours') {
            fetch.fetchUrl(url, function (error, meta, body) {
                const data = JSON.parse(body.toString())
                const specHours = data['response']['games'].filter((obj) => obj.appid === 381210)[0]
                const totalHours = Math.round((specHours.playtime_forever * 100) / 60) / 100
                console.log(totalHours)
                fetch.fetchUrl(addresses['hours'] + '?' + new URLSearchParams({ hours: totalHours }), function (error, meta, body) {
                    console.log(body)
                })
            })
        }
        else if (specificCommand === 'Stats') {
            
        }
    }
})