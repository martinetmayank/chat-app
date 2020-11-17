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

    const welcomeMsg = 'Welcome!'
    socket.emit('message', welcomeMsg)

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})