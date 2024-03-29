const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message')

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRomm
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// Sending "Welcome message to all the client

io.on('connection', (socket) => {
    console.log('New Websocket connection...')

    socket.on('join', ({
        username,
        room
    }, callback) => {
        const {
            error,
            user
        } = addUser({
            id: socket.id,
            username,
            room,
        })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('System', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('System', `${user.username} has joined`))

        io.to(user.room).emit('roomMembers', {
            room: user.room,
            users: getUsersInRomm(user.room)
        })

        callback()

    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            console.log(message, 'is profane.')
            return callback(`${message} is not allowed!`)
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coordinates, callback) => {
        const user = getUser(socket.id)
        const url = `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url))

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('System', `${user.username} left the room.`))

            io.to(user.room).emit('roomMembers', {
                room: user.room,
                users: getUsersInRomm(user.room)
            })
        }

    })

})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}!`)
})