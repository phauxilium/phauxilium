//  -------------------- TODOS ----------------------
//  MAKE NOTIFICATIONS REALTIME

const express = require('express')
const route = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const FireAdmin = require('../my_modules/FireAdmin')
const fire = new FireAdmin()
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let uType = ''

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
            uType = datas.uType
            res.render('profile/profile', {docs: datas, channel: sessionID})
        })
    }
})

// View my profile
route.post('/my/profile', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}`)
    ref.once('value', snapshots => {
        let datas = snapshots.val()
        res.send(datas)
    })   
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


// ----------- View All Notifications ----------------
route.post('/view/notifs', (req, res) => {
    let ussID = req.session.ussID
    let arrData = []
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${ussID}/notifs`)

    ref.once('value', snapshots => {
        let datas = snapshots.val()
        res.send(datas)
    }) 
})


// -------------- View Individual Notification -----------------
route.post('/view/notif', (req, res) => {
    let notifID = req.body.notifID
    let uid = req.session.ussID
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${uid}/notifs/${notifID}`)
    ref.once('value', snapshots => {
        let datas = snapshots.val()
        res.send(datas)
        if(datas.status === 'new') {
            ref.update({
                status: 'old'
            })
        }
    })
})

// ------------- Signout --------------
route.get('/s/o', (req, res) => {
    if(req.session.ussID) {
        req.session.destroy(err => {
            if(!err) res.redirect('/')
        })
    } else res.redirect('/')
})


module.exports = (io) => {
    io.on('connection', socket => {
        socket.on('signed in', room => {
            const fire = new FireAdmin()
            const db = fire.firebase.database()
            socket.join(room, () => {
                // Notifs count
                let ref = db.ref(`users/${room}/notifs`)                
                ref.on('value', snapshots => {
                    let notifs = snapshots.val()
                    let count = 0
                    for(notif in notifs) {
                        if(notifs[notif] !== 0) {
                            if(notifs[notif].status === 'new') count++
                        }
                    }
                    io.to(room).emit('notif count', count)
                    io.to(room).emit('notif updates', notifs)
                })

                // Messages count
                ref = db.ref(`users/${room}/messages`)
                ref.on('value', snapshots => {
                    io.to(room).emit('chat count', snapshots.numChildren())
                })

                // Doctor specialty update
                if(uType === 'doctor') {
                    ref = db.ref(`users/${room}/specialty`)
                    ref.on('value', snapshots => {
                        io.to(room).emit('specialty updates', snapshots.val())
                    })
                }
            })
        })
    })
    return route
}
