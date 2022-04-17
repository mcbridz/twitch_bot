const express = require('express')
const DB_NAME = 'Cached_Data'
const port = process.env.PORT || 8000

var app = require('./back_end/backbone')({
    dbname: DB_NAME
})


app.listen(port, () => {
    console.log('server listening on port: ' + port + '...')
})
