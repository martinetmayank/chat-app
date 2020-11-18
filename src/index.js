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

// Sending "Welcome message to all the client

io.on('connection', (socket) => {
    console.log('New Websocket connection...')

    socket.broadcast.emit('message', 'A new user has joined.')

    const welcomeMsg = 'Welcome!'
    socket.emit('message', welcomeMsg)

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('sendLocation', (coordinates) => {
        io.emit('message', `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left.')
    })

})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})