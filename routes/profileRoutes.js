
const express = require('express')
const route = express.Router()
const fs = require('fs')
const validator = require('validator')
const multer = require('multer')
const upload = multer({
    dest: './uploads'
})
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const FireAdmin = require('../my_modules/FireAdmin')
const Cloudinary = require('../my_modules/Cloudinary')
const cloudinary = new Cloudinary()
// const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let uType = ''


cloudinary.getConfig()

// ------------- Profile route --------------
route.get('/t/', (req, res) => {
    const sessionID = req.session.ussID
    if(sessionID === undefined) {
        res.redirect('/')
    } else {
        const fire = new FireAdmin()
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


// Retrieve all patient files
route.post('/view/all/patient-files', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}/patientFiles`)
    ref.once('value', snapshots => {
        let datas = snapshots.val()
        res.send(datas)
    })
})


// Delete a specific patient profile
route.post('/del/patient-profile', (req, res) => {
    let key = req.body.key
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}/patientFiles`)
    const childRef = ref.child(key)
    childRef.remove(err => {
        ref.once('value', snapshots => {
            res.send(snapshots.val())
        })
    })
})

// View a specific patient profile
route.post('/view/individual/patient-profile', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}/patientFiles/${req.body.key}`)
    ref.once('value', snapshots => {
        res.send(snapshots.val())
    })
})

// Add Medical Records
route.post('/add/med-records', upload.single('attach'), (req, res, next) => {
    let error = {}
   if(req.file === undefined && !req.body.complains && !req.body.findings) {
       error.fileErr = 'Please provide some data.'
       res.send(error)
   } else if(!req.body.key) {
       error.fileErr = 'An error occur'
       res.send(error)
   } else {
       if(req.file === undefined) {
           const fire = new FireAdmin()
           const db = fire.firebase.database()
           const ref = db.ref(`users/${req.session.ussID}/patientFiles/${req.body.key}/medRecords`)
           ref.once('value', snapshots => {
               let childRef = ref.child(snapshots.numChildren())
               childRef.update({
                   complains: req.body.complains,
                   findings: req.body.findings,
                   filename: '',
                   attached: '',
                   date: new Date().toString()
               }, err => {
                   if (!err) res.send(error)
               })
           })
       } else {
           mimetype = req.file.mimetype
           originalname = req.file.originalname
           filename = req.file.filename
           if (mimetype.split('/')[0] === 'image' || mimetype.split('/')[1] === 'pdf') {
                  cloudinary.getCloud().v2.uploader.upload(req.file.path, {
                      public_id: `ax-images/doctor/assets/${req.file.filename}`
                  }, err => {
                          if (!err) {
                              fs.unlink(req.file.path, err => {
                                  if (!err) {
                                       const fire = new FireAdmin()
                                       const db = fire.firebase.database()
                                       const ref = db.ref(`users/${req.session.ussID}/patientFiles/${req.body.key}/medRecords`)
                                       ref.once('value', snapshots => {
                                           let childRef = ref.child(snapshots.numChildren())
                                           childRef.update({
                                               complains: req.body.complains,
                                               findings: req.body.findings,
                                               filename: filename,
                                               attached: originalname,
                                               date: new Date().toString()
                                           }, err => {
                                               if(!err) res.send(error) 
                                           })
                                       })
                                  } else {
                                      error.fileErr = 'An error occur.'
                                      res.send(error)
                                  }
                              })
                          } else {
                              error.fileErr = err.message
                              res.send(error)
                          }
                  })
           } else {
               fs.unlink(req.file.path, err => {
                   if (!err) {
                       error.fileErr = `Invalid file type. Images and PDF's are only allowed`
                       res.send(error)
                   }
               })
           }
       }
   }
})

// Submit Patient Registration
route.post('/submit/patient-reg', (req, res) => {
    let err = {}
    err.fnameErr = !req.body.fname ? 'Input required.' : ''
    err.mnameErr = !req.body.mname ? 'Input required.' : ''
    err.lnameErr = !req.body.lname ? 'Input required.' : ''
    err.genderErr = !req.body.gender ? 'Input required.' : ''
    err.cStatusErr = !req.body.cStatus ? 'Input required.' : ''
    err.addressErr = !req.body.address ? 'Input required.' : ''
    err.historyErr = !req.body.history ? 'Input required.' : ''

    if(req.body.email) {
        err.emailErr = !validator.isEmail(req.body.email) ? 'Invalid email.' : ''
    }

    if(!req.body.dob) {
        err.dobErr = 'Input required.'    
    } else if(new Date(req.body.dob).toString() === 'Invalid Date') {
        err.dobErr = 'Invalid date'
    } else {
        err.dobErr = ''
    }

    let errExist = []
    for(let key in err) {
        if(err[key].indexOf('Invalid') === 0) {
            errExist.push(true)
        }
    }

    if(errExist.indexOf(true) === -1 && req.body.history) {
        let today = new Date();
        let birthDate = new Date(req.body.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref(`users/${req.session.ussID}/patientFiles`)
        ref.push({
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            dob: req.body.dob,
            gender: req.body.gender,
            age: age,
            cStatus: req.body.cStatus,
            address: req.body.address,
            bloodType: req.body.bloodType,
            email: req.body.email,
            occupation: req.body.occupation,
            companion: req.body.companion,
            history: req.body.history,
            date: today.toString(),
            medRecords: [0]
        }, (error) => res.send(err))
    } else res.send(err)
})

// -------------- Search ---------------------
// Search Results
route.post('/search/', (req, res) => {
    if(req.session.ussID === undefined || req.session.ussID === '') {
        res.redirect('/')
    } else {
        let id = req.body.id.toLowerCase().split(' ')
        let results = {}
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')
        ref.once('value', snapshots => {
            let datas = snapshots.val()
            id.forEach(value => {
                for (let key in datas) {
                    if (key !== req.session.ussID) {
                        for (k in datas[key].basicInfo) {
                            if (datas[key].basicInfo[k].toLowerCase().indexOf(value) !== -1)
                                results[key] = datas[key]
                        }

                        //  Temporary Clinic Search
                        if(datas[key].uType === 'doctor') {
                            for (k in datas[key].clinics[0]) {
                                if (
                                    (datas[key].clinics[0].address.toLowerCase().indexOf(value) !== -1) ||
                                    (datas[key].clinics[0].name.toLowerCase().indexOf(value) !== -1)
                                    ) results[key] = datas[key]
                            }
                        }
                    }
                }
            })
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

// ---------------- Patient Set Appointment ------------------
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
        let ref = db.ref(`users/${req.session.ussID}`)
        
        ref.once('value', snapshots => {
            let datas = snapshots.val()
            let name = `${datas.basicInfo.fname} ${datas.basicInfo.mname} ${datas.basicInfo.lname}`

            // Set Doctors Appointment
            ref = db.ref(`users/${sched.key}`)
            let childRef = ref.child('appointments')
            
            childRef.push({
                    date: sched.date.toString(),
                    time: sched.time,
                    receiver: sched.key,
                    sender: req.session.ussID,
                    name: name,
                    img: datas.basicInfo.profile,
                    status: 'pending',
                    uType: 'patient'
                }).then(snap => {
                    // Set Doctors Notificatiton
                    childRef = ref.child('notifs')
                    childRef.once('value', count => {
                        childRef = ref.child(`notifs/${count.numChildren()}`)
                        childRef.update({
                            date: new Date(),
                            message: `${name} wants to set an appointment with you at ${finalDate}`,
                            name: name,
                            receiver: sched.key,
                            sender: req.session.ussID,
                            img: datas.basicInfo.profile,
                            uType: 'patient',
                            type: 'pending',
                            status: 'new'
                        }, err => {
                            if (!err) res.send(sched.err)
                        })
                    })

                    // Set patients appointment
                    ref = db.ref(`users/${req.session.ussID}/appointments`)
                    childRef = ref.child(snap.key)
                    childRef.update({
                        sender: req.session.ussID,
                        receiver: sched.key,
                        date: sched.date,
                        time: sched.time,
                        name: name,
                        img: datas.basicInfo.profile,
                        status: 'pending',
                        uType: 'doctor'
                    })
                })
        })
    } else {
        res.send(sched.err)
    }
})


// ----------- View Appointments ------------
route.post('/get-schedules', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}/appointments`)
    let schedules = {}
    if(req.body.type === 'today') {
        ref.once('value', snapshots => {
            let datas = snapshots.val()
            for(key in datas) {
                if(datas !== 0) {
                    if(datas[key].status === 'today') {
                        schedules[key] = datas[key]
                    }
                }
            }
            res.send(schedules)
        })
    } else if(req.body.type === 'pending') {
        ref.once('value', snapshots => {
            let datas = snapshots.val()
            for (key in datas) {
                if (datas !== 0) {
                    if (datas[key].status === 'pending') {
                        schedules[key] = datas[key]
                    }
                }
            }
            res.send(schedules)
        })
    } else if(req.body.type === 'upcoming') {
        ref.once('value', snapshots => {
            let datas = snapshots.val()
            for (key in datas) {
                if (datas !== 0) {
                    if (datas[key].status === 'upcoming') {
                        schedules[key] = datas[key]
                    }
                }
            }
            res.send(schedules)
        })
    } else {
        res.sendStatus(500)
    }
})

// Accept Appointment request
route.post('/accept-req', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    let ref = db.ref(`users/${req.session.ussID}`)
    ref.once('value', snapshots => {
        let datas = snapshots.val()
        let name = `${datas.basicInfo.fname} ${datas.basicInfo.mname} ${datas.basicInfo.lname}`
        let avatar = datas.basicInfo.profile

        let childRef = ref.child(`appointments/${req.body.appointmentID}`)        
        childRef.once('value', snapshots => {
            let datas = snapshots.val()
            let date = new Date(datas.date).toString().split(' ')
            let dateStr = `${date[0]} ${date[1]} ${date[2]} ${date[3]}`
            let dateNow = new Date().toString().split(' ')
            let dateNowStr = `${dateNow[0]} ${dateNow[1]} ${dateNow[2]} ${dateNow[3]}`

            if (dateStr === dateNowStr) {
                childRef.update({
                    status: 'today'
                })
            } else {
                childRef.update({
                    status: 'upcoming'
                })
            }

            ref = db.ref(`users/${req.body.sender}/notifs`)
            ref.once('value', count => {
                childRef = ref.child(count.numChildren())
                childRef.update({
                    date: new Date(),
                    message: `Dr. ${name} accepted your request.`,
                    name: name,
                    receiver: req.body.sender,
                    sender: req.session.ussID,
                    img: avatar,
                    uType: 'doctor',
                    type: 'message',
                    status: 'new'
                }, err => {
                    if(!err) {
                        ref = db.ref(`users/${req.body.sender}/appointments`)
                        childRef = ref.child(req.body.appointmentID)
                        if (dateStr === dateNowStr) {
                            childRef.update({
                                status: 'today'
                            }, err => {
                                if(!err) res.send({ nice :'nice' })
                            })
                        } else {
                            childRef.update({
                                status: 'upcoming'
                            }, err => {
                                    if (!err) res.send({ nice: 'nice' })
                            })
                        }
                    }
                })
            })
        })
    })
})

// ----------- Get Individual Messages
route.get('/messages/:id', (req, res) => {
    if(req.session.ussID === '' || req.session.ussID === undefined) res.redirect('/')
    else {
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        let ref = db.ref('users/')
        ref.orderByKey().equalTo(req.params.id).once('value', snapshots => {
            if(snapshots.val() === null) res.redirect('/')
            else {
                ref = db.ref(`users/${req.params.id}`)
                ref.once('value', snapshots => {
                    let from = snapshots.val()
                    ref = db.ref(`users/${req.session.ussID}/messages`)
                    ref.once('value', messages => {
                        let mine = messages.val()
                        let msg = {}
                        for (let key in mine) {
                            if (key === req.body.id) {
                                msg[key] = mine[key]
                            }
                        }
                        res.render('profile/message', { mine: mine, from: from, msg: msg, key: req.params.id, channel: req.session.ussID })
                    })
                })
            }
        })
    }
})

// Get all message
route.post('/view/messages', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}/messages`)
    ref.once('value', snapshots => {
        let datas = snapshots.val()
        let msgObj = {}
        for(let key in datas) {
            if(datas[key].sender !== req.session.ussID && key !== '0') {
                msgObj[datas[key].sender] = {
                    date: datas[key].date,
                    msg: crypto.decrypt(datas[key].msg, (err, data) => data),
                    receiver: datas[key].receiver,
                    sender: datas[key].sender,
                    status: datas[key].status,
                    key: key,
                    profile: datas[key].profile,
                    name: datas[key].name,
                    uType: datas[key].uType
                }
            }
        }
        res.send(msgObj)
    })
})

// Update Message
route.post('/update-msg', (req, res) => {
    const fire = new FireAdmin()
    const db = fire.firebase.database()
    const ref = db.ref(`users/${req.session.ussID}/messages`)
    const childRef = ref.child(req.body.key)
    childRef.update({
        status: 'old'
    })
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

        // Send Message
        socket.on('chat send', data => {
            const fire = new FireAdmin()
            const db = fire.firebase.database()
            let ref = db.ref(`users/${data.sender}`)
            ref.once('value', snapshots => {

                let datas = snapshots.val()
                let name = `${datas.basicInfo.fname} ${datas.basicInfo.mname} ${datas.basicInfo.lname}`
                let uType = datas.uType
                let profile = datas.basicInfo.profile

                // Senders copy
                ref = db.ref(`users/${data.sender}/messages`)
                ref.once('value', snapshots => {
                    let id = snapshots.numChildren()
                    let childRef = ref.child(id)
                    childRef.update({
                        sender: data.sender,
                        receiver: data.receiver,
                        msg: crypto.encrypt(data.msg),
                        date: new Date().toString(),
                    })
                })

                // Receivers Copy
                ref = db.ref(`users/${data.receiver}/messages`)
                ref.once('value', snapshots => {
                    let datas = snapshots.val()
                    let id = snapshots.numChildren()
                    let childRef = 0

                    // Update new messages to old
                    for (let key in datas) {
                        if (datas[key].receiver === data.receiver && datas[key].sender === data.sender && datas[key].status === 'new') {
                            childRef = ref.child(key)
                            childRef.update({
                                status: 'old'
                            })
                        }
                    }

                    // Inserting new message
                    childRef = ref.child(id)
                    childRef.update({
                        sender: data.sender,
                        receiver: data.receiver,
                        msg: crypto.encrypt(data.msg),
                        date: new Date().toString(),
                        status: 'new',
                        name: name,
                        uType: uType,
                        profile: profile
                    })
                })
            })
        })

        // For Realtime Updates
        socket.on('signed in', room => {
            const fire = new FireAdmin()
            const db = fire.firebase.database()
            socket.join(room, () => {
                // Notifs count && updates
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

                // Messages count && Updates
                ref = db.ref(`users/${room}/messages`)
                ref.on('value', snapshots => {
                    let count = 0
                    let msgObj = {}
                    let msgs = snapshots.val()
                    for (msg in msgs) {
                        if (msgs[msg] !== 0) {
                            if (msgs[msg].status === 'new') count++
                            msgObj[msg] = {
                                date: msgs[msg].date,
                                msg: crypto.decrypt(msgs[msg].msg, (err, data) => data),
                                receiver: msgs[msg].receiver,
                                sender: msgs[msg].sender,
                            }
                        }
                    }
                    io.to(room).emit('chat count', count)
                    io.to(room).emit('chat updates', msgObj)

                    let datas = snapshots.val()
                    let msgsObj = {}
                    for (let key in datas) {
                        if (datas[key].sender !== room && key !== '0') {
                            msgsObj[datas[key].sender] = {
                                date: datas[key].date,
                                msg: crypto.decrypt(datas[key].msg, (err, data) => data),
                                receiver: datas[key].receiver,
                                sender: datas[key].sender,
                                status: datas[key].status,
                                key: key,
                                profile: datas[key].profile,
                                name: datas[key].name,
                                uType: datas[key].uType
                            }
                        }
                    }
                    io.to(room).emit('all chats updates', msgsObj)
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
