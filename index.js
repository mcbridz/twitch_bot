const tmi = require('tmi.js')
const oAuth = process.env.oAuth || require('./secrets').twitch_Oauth

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'zaknefarious_bot',
        password: oAuth
    },
    channels: ['zaknefarious']
})

client.connect()
    .then(() => {
    console.log('bot connected')
})

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`)
    if (self) return
    if (message.toLowerCase() === `!hello`) {
        client.say(channel, `@${tags.username}, hello, world!`)
    }
})