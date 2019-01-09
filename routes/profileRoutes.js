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

            // let date = new Date(datas.notifs[1].date)
            // let dateNow = new Date(datas.notifs[1].date)
            // let dateStr = date.toString()
            // let dateNowStr = dateNow.toString()
            // console.log(dateStr === dateNowStr)
            // console.log(date)
            // console.log(dateNow)

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


// ----------- View All Notifications ----------------
route.post('/view/notifs', (req, res) => {
    let ussID = req.session.ussID
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${ussID}/notifs`)
    ref.once('value', snapshots => {
        res.send(snapshots.val())
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
                // Notifs
                let ref = db.ref(`users/${room}/notifs`)                
                ref.on('value', snapshots => {
                    let notifs = snapshots.val()
                    let count = 0
                    for(notif in notifs) {
                        if(notifs[notif] !== 0) {
                            if(notifs[notif].status === 'new') count++
                        }
                    }
                    io.to(room).emit('notif updates', count)
                })

                // Messages
                ref = db.ref(`users/${room}/messages`)
                ref.on('value', snapshots => {
                    io.to(room).emit('chat updates', snapshots.numChildren())
                })

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
