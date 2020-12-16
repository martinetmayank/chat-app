const socket = io()

// * Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')


//  Here `message` is a parameter which we,
//  client 'emits' to the server
//  and 'sendMessage' is the event name.

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disabling the form
    const message = document.querySelector("#enterMessage").value

    socket.emit('sendMessage', message, (error) => {
        // Enabling the form

        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

socket.on('message', (message) => {
    console.log(message)
})

const locationBtn = document.querySelector("#send-location")
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })

})