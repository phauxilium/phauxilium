const express = require('express')
const route = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const FireAdmin = require('../my_modules/FireAdmin')
const fire = new FireAdmin()

// ------------- Profile route --------------
route.get('/t/', (req, res) => {
    const sessionID = req.session.ussID
    if(sessionID === undefined) {
        res.redirect('/')
    } else {
        const db = fire.firebase.database()
        const ref = db.ref('users')
        const childRef = ref.child(sessionID)
        childRef.once('value', snapshots => {
            let datas = snapshots.val()
            res.render('profile/profile', {docs: datas, channel: sessionID})
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
        socket.on('signed in', room => {
            const fire = new FireAdmin()
            const db = fire.firebase.database()
            socket.join(room, () => {
                // Notifs
                let ref = db.ref(`users/${room}/notifs`)                
                ref.on('value', snapshots => {
                    io.to(room).emit('notif updates', snapshots.val())
                })

                // Messages
                ref = db.ref(`users/${room}/messages`)
                ref.on('value', snapshots => {
                    io.to(room).emit('chat updates', snapshots.val())
                })

                ref = db.ref(`users/${room}/specialty`)
                ref.on('value', snapshots => {
                    io.to(room).emit('specialty updates', snapshots.val())
                })
            })
        })
    })
    return route
}
