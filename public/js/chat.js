const socket = io()

/**
 * Here `count` is a parameter which we get when
 * server 'emits' some data.
 * All the data passed from server can be accessed
 * via callback function.
 */

socket.on('countUpdated', (count) => {
    console.log('Count has been updated!', count)
})

const incrementBtn = document.querySelector('#increment')
incrementBtn.addEventListener('click', () => {
    console.log('Clicked')
    socket.emit('increment')
})