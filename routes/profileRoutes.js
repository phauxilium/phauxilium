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
            let email = crypto.decrypt(datas.auth.email, (err, data) => data)
            let prc = crypto.decrypt(datas.basicInfo.prc, (err, data) =>data)
            uType = datas.uType
            res.render('profile/profile', {docs: datas, channel: sessionID, email: email, prc: prc})
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
        let email = crypto.decrypt(datas.auth.email, (err, data) => data)
        let prc = crypto.decrypt(datas.basicInfo.prc, (err, data) => data)
        res.send({datas: datas, email: email, prc: prc})
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


// Doctor Add Schedule
route.post('/add/schedules', (req, res) => {
    let err = {}

    let bodyNotNull = []
    for(let key in req.body){
        if(req.body[key] !== '')
            bodyNotNull.push(true)
    }

    err.fromErr0 = !req.body.from0 && req.body.to0 ? 'Invalid time' : ''
    err.toErr0 = req.body.from0 && !req.body.to0 ? 'Invalid time' : ''

    err.fromErr1 = !req.body.from1 && req.body.to1 ? 'Invalid time' : ''
    err.toErr1 = req.body.from1 && !req.body.to1 ? 'Invalid time' : ''

    err.fromErr2 = !req.body.from2 && req.body.to2 ? 'Invalid time' : ''
    err.toErr2 = req.body.from2 && !req.body.to2 ? 'Invalid time' : ''

    err.fromErr3 = !req.body.from3 && req.body.to3 ? 'Invalid time' : ''
    err.toErr3 = req.body.from3 && !req.body.to3 ? 'Invalid time' : ''

    err.fromErr4 = !req.body.from4 && req.body.to4 ? 'Invalid time' : ''
    err.toErr4 = req.body.from4 && !req.body.to4 ? 'Invalid time' : ''

    err.fromErr5 = !req.body.from5 && req.body.to5 ? 'Invalid time' : ''
    err.toErr5 = req.body.from5 && !req.body.to5 ? 'Invalid time' : ''

    err.fromErr6 = !req.body.from6 && req.body.to6 ? 'Invalid time' : ''
    err.toErr6 = req.body.from6 && !req.body.to6 ? 'Invalid time' : ''

    let containsErr = []
    for(let key in err) {
        if(err[key] === 'Invalid time') {
            containsErr.push(true)
            err.nullErr = 'Invalid input.'
        }
    }

    if(bodyNotNull.indexOf(true) !== -1 && containsErr.indexOf(true) === -1) {
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref(`users/${req.session.ussID}/clinics/${req.body.cID}/`)
        ref.update({
            schedules: {
                from: {
                    0: req.body.from0,
                    1: req.body.from1,
                    2: req.body.from2,
                    3: req.body.from3,
                    4: req.body.from4,
                    5: req.body.from5,
                    6: req.body.from6,
                },
                to: {
                    0: req.body.to0,
                    1: req.body.to1,
                    2: req.body.to2,
                    3: req.body.to3,
                    4: req.body.to4,
                    5: req.body.to5,
                    6: req.body.to6,
                }
            }
        }, (err) => {
                if(!err) res.send({ time: req.body, err })
        })
    } else {
        res.send({ time: req.body, err })
    }
})


// -------------- Search ---------------------
// Search Results
route.post('/search/', (req, res) => {
    if(req.session.ussID === undefined || req.session.ussID === '') {
        res.redirect('/')
    } else {
        let id = req.body.id.toLowerCase()
        let results = {}
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')
        ref.once('value', snapshots => {
            let datas = snapshots.val()
            for (let key in datas) {
                if(key !== req.session.ussID) {
                    for (k in datas[key].basicInfo) {
                        if (datas[key].basicInfo[k].toLowerCase().indexOf(id) !== -1)
                            results[key] = datas[key]
                    }
                }
            }
            res.send(results)
        })
    }
})


// --------------- View Searched Profile ----------------
route.post('/i/search', (req, res) => {
    if(req.session.ussID === '' || req.session.ussID === undefined) {
        res.redirect('/')
    } else {
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref(`users/${req.body.id}`)
        ref.once('value', snapshots => {
            let datas = snapshots.val()        
            let email = crypto.decrypt(datas.auth.email, (err, data) => data)
            res.send({ datas: datas, email: email })
        })
    }
})


// ------------------- View Searched Doctor Schedules -----------------
route.post('/view/sched', (req, res) => {
    let key = req.body.key
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${key}/clinics/0/schedules`)
    ref.once('value', snapshots => {
        res.send(snapshots.val())
    })
})

// ---------------- Set Appointment ------------------
route.post('/set/appointment', (req, res) => {
    let dateNow = new Date()
    let sched = {
        date: new Date(req.body.date),
        time: req.body.time,
        key: req.body.key,
        err: {}
    }

    if(sched.date.toString() === 'Invalid Date') sched.err.errDate = 'Date cannot be empty.'
    else if(sched.date < dateNow) sched.err.errDate = 'Invalid date.'
    else sched.err.errDate = ''
    sched.err.errTime = !sched.time ? 'Time cannot be empty' : ''
    sched.err.errKey = !sched.key ? 'An error occur' : ''
    
    if(!sched.err.errDate && !sched.err.errTime && !sched.err.errKey) {
        let dateStr =sched.date.toString().split(' ')
        let time = dateStr[4].split(':')
        let hours = time[0] > 12 ? time[0] - 12 : time[0]
        let meridiem = time[0] > 12 ? 'pm' : 'am'
        let finTime = `${hours}:${time[1]} ${meridiem}`
        let finalDate = `${dateStr[0]} - ${dateStr[1]} ${dateStr[2]}, ${dateStr[3]} ${finTime}`

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref(`users/${sched.key}`)

        ref.once('value', snapshots => {
            let datas = snapshots.val()
            let name = `${datas.basicInfo.fname} ${datas.basicInfo.mname} ${datas.basicInfo.lname}`

            let childRef = ref.child('appointments')
            childRef.once('value', count => {
                childRef = ref.child(`appointments/${count.numChildren()}`)
                childRef.update({
                    date: sched.date,
                    time: sched.time,
                    name: name,
                    img: datas.basicInfo.profile,
                    status: 'pending'
                })
            })

            childRef = ref.child('notifs')
            childRef.once('value', count => {
                childRef = ref.child(`notifs/${count.numChildren()}`)
                childRef.update({
                    date: new Date(),
                    message: `${name} wants to set an appointment with you at ${finalDate}`,
                    from: name,
                    key: sched.key,
                    img: datas.basicInfo.profile,
                    uType: datas.uType,
                    type: 'pending',
                    status: 'new'
                }, err => {
                    if (!err) res.send(sched.err)
                })
            })
        })
    } else {
        res.send(sched.err)
    }
})


// ------------- Signout --------------
route.get('/sign/o', (req, res) => {
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
