const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message')

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

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined.'))

    // const welcomeMsg = 'Welcome!'
    // socket.emit('message', welcomeMsg)

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            console.log(message, 'is profane.')
            return callback(`${message} is not allowed!`)
        }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coordinates, callback) => {
        const location = `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
        io.emit('locationMessage', generateLocationMessage(location))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left.'))
    })

})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})