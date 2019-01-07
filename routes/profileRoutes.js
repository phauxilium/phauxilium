const express = require('express')
const route = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const FireAdmin = require('../my_modules/FireAdmin')
const fire = new FireAdmin()
let room = ''

// ------------- Profile route --------------
route.get('/t/', (req, res) => {
    let sessionID = req.session.ussID
    room = sessionID
    if(sessionID === undefined) {
        res.redirect('/')
    } else {
        const db = fire.firebase.database()
        const ref = db.ref('users')
        const childRef = ref.child(sessionID)
        childRef.once('value', snapshots => {
            let datas = snapshots.val()
            res.render('profile/profile', datas)
        })
    }
})

// Adding Doctor Datas
route.post('/d/add', (req, res) => {
    let datas = {
        specialization: req.body.specialization,
        err: {}
    }

    if (datas.specialization === '') {
        datas.err.specializationErr = 'Cannot be empty.'
        res.send(datas.err)
    } else {
        datas.err.specializationErr = ''

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref(`users/${req.session.ussID}`)
        const child = ref.child('specialty')
        let specialization = datas.specialization

        child.push({
            specialization
        }, (err) => {
            if (!err) {
                datas.err.specializationErr = ''
            } else datas.err.specializationErr = `Something wen't wrong`
            // datas.err.specializationErr = err ? `Something wen't wrong` : ''
            res.send(datas.err)
        })
    }
})

// ------------- Signout --------------
route.get('/s/o', (req, res) => {
    if(req.session.ussID) {
        req.session.destroy(err => {
            if(!err) res.send('Destroyed')
        })
    } else res.redirect('/')
})

module.exports = (io) => {
    io.on('connection', socket => {
        if(room) {
            // console.log(room)
            const fire = new FireAdmin()
            const db = fire.firebase.database()
            const ref = db.ref(`users/${room}/notifs`)
            // Displaying data when signed in
            ref.on('value', snapshots => {
                socket.join(room)
                io.to(room).emit('notif updates', snapshots.val())
                // console.log(room)
            })
        }
    })

    return route
}
