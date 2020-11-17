const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()

/**
 * Socket.io requires a raw http server.
 * That's why we had created a 'server'
 */
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

/**
 * Here we have a 'server' which 'emits' an event
 * and client 'recieves', which is 'countUpdated'
 *
 * *This is on `Chat.js`
 * And we have a 'client' which 'emits' an event
 * and server 'recieves', which is 'increment'
 */

io.on('connection', (socket) => {
    console.log('New Websocket connection...')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++

        // socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})