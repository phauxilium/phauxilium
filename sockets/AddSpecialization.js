const FireAdmin = require('../my_modules/FireAdmin')
const fire = new FireAdmin()

module.exports = (io) => {
    io.on('connection', socket => {
        // socket.on('specializationUpdate', data => {
        //     let room = data.room
        //     const db = fire.firebase.database()
        //     const ref = db.ref(`users/${room}`)
        //     const childRef = ref.child('specialty')
        //     childRef.once('value', snapshots => {
        //         io.to(room).emit('updateSpecialty', snapshots.val())
        //         console.log(snapshots.val())
        //     })
        // })

        socket.on('join', room => {
            socket.join(room)
        })

        socket.on('specializationUpdate', room => {
            const db = fire.firebase.database()
            const ref = db.ref(`users/${room}`)
            const childRef = ref.child('specialty')
            childRef.once('value', snapshots => {
                io.to(room).emit('updateSpecialty', snapshots.val())
            })
        })
    })
}