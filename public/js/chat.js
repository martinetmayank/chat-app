const socket = io()

//  Here `message` is a parameter which we,
//  client 'emits' to the server
//  and 'sendMessage' is the event name.

const messageForm = document.querySelector("#message-form")
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = document.querySelector("#enterMessage").value
    socket.emit('sendMessage', message)
})

socket.on('message', (message) => {
    console.log(message)
})