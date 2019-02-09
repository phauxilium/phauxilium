const express = require('express')
const validator  = require('validator')
const FireAdmin = require('../my_modules/FireAdmin')
const router = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const SendGrid = require('../my_modules/SendGrid')

router.get('/', (req, res) => {
    if (!req.session.ussID || req.session.profileComplete === false) res.render('index/index')
    else res.redirect('/u/t')
})

router.get('/about', (req, res) => {
    if (!req.session.ussID || req.session.profileComplete === false) res.render('index/about')
    else res.redirect('/u/t')
})

router.get('/contact', (req, res) => {
    if (!req.session.ussID || req.session.profileComplete === false) res.render('index/contact')
    else res.redirect('/u/t')
})


// ----------------------- Sign in ------------------
router.post('/signin', (req, res) => {
    let auth = {
        key: '',
        email: req.body.email,
        password: req.body.password,
        err: {}
    }

    if(auth.email === '' || auth.password === '') {
        if(auth.email === '')
            auth.err.emailErr = 'Email cannot be empty'

        if(auth.password === '')
            auth.err.passwordErr = 'Password cannot be empty'

        res.send(auth.err)

    } else {
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')

        auth.key = auth.email.indexOf('@') !== -1 ? auth.email.split('@')[0] : auth.email
        
        const encryptKey = crypto.encrypt(auth.key.toLowerCase())
        
        const childRef = ref.child(encryptKey)

        childRef.once('value', snapshots => {
            let datas = snapshots.val()
            if (datas === null) {
                auth.err.emailErr = 'Invalid email address.'
                res.send(auth.err)
            } else {
                let email = crypto.decrypt(datas.auth.email, (err, data) => data)
                if(auth.email.indexOf('@') !== -1) 
                    if (auth.email.toLowerCase() !== email.toLowerCase())
                        auth.err.emailErr = 'Invalid email address.'
                    else
                        auth.err.emailErr = ''

                if(auth.err.emailErr) {
                    res.send(auth.err)
                } else {   
                    if (crypto.encrypt(auth.password) !== datas.auth.password) {
                    auth.err.passwordErr = 'Invalid password.'
                    res.send(auth.err)
                    } else {
                        req.session.ussID = encryptKey
                        if (datas.status.profileComplete === false) {
                            req.session.profileComplete = false
                            auth.err.completeErr = true
                            res.send(auth.err)
                        } else {
                            req.session.profileComplete === true
                            res.send(auth.err)
                        }
                    }
                }
            }
        })
    }
})


//  --------------------- Signup ----------------------
router.post('/signup', (req, res) => {
    let auth = {
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
        err: {}
    }

    if (!validator.isEmail(auth.email)) {
        auth.err.emailErr = 'Invalid email address'
    } else if(!auth.email) {
        auth.err.emailErr = 'Email cannot be empty'
    }

    auth.err.passwordErr = auth.password.length < 8 ? 'Password must not be less than 8 characters' : ''

    auth.err.cpasswordErr = auth.password !== auth.cpassword ? 'Password does not match' : ''


    if (!auth.err.emailErr && !auth.err.passwordErr && !auth.err.cpasswordErr) {
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')
        let key = crypto.encrypt(auth.email.split('@')[0].toLowerCase())
        ref.orderByKey().equalTo(key).once('value', snapshots => {
            if(snapshots.val() === null) {
                let random1 = Math.ceil(Math.random() * 1000 + 500)
                let random2 = Math.floor(Math.random() * 2000 + 300)

                req.session.evcode = `${random1}${random2}`
                req.session.evemail = auth.email
                req.session.evpassword = auth.password

                // ---------- Send grid API ------------
                let mail = new SendGrid()
                mail.getApi()
                mail.setMail(
                    auth.email,
                    `<p>You're verification code is <u style="color:blue; font-weight:bold;">${req.session.evcode}</u></p>`
                )

                let message = mail.getMail()
                mail.sendMail(message, err => {
                    if(err) {
                        auth.err.sendFailed = 'An error occur'
                        res.send(auth.err)
                    } else {
                        res.send(auth)
                    }
                })
            } else {
                auth.err.emailErr = 'Email already exist'
                res.send(auth.err)
            }
        })
    } else {
        res.send(auth.err)
    }
})



// ----------- Account Verification ----------------
router.post('/e/v', (req, res) => {
    let codeAuth = {
        code: req.body.code,
        err: {
            codeErr: ''
        }
    }

    if(codeAuth.code !== req.session.evcode) {
        codeAuth.err.codeErr = 'Invalid code'
        res.send(codeAuth.err)
    } else {
        const auth = {
            key: crypto.encrypt(req.session.evemail.split('@')[0].toLowerCase()),
            email: crypto.encrypt(req.session.evemail),
            password: crypto.encrypt(req.session.evpassword)
        }

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')

        const userRef = ref.child(auth.key)
        userRef.set({
            auth: {
                email: auth.email,
                password: auth.password,
            },
            status: {
                profileComplete: false
            }
        }, err => {
            if(err) {
                codeAuth.err.insertFailed = 'An error occur'
                res.send(codeAuth.err)
            } else {
                res.send(codeAuth.err)
            }
        }) 
    }
})

// ---------------- Patient Complete Signup
router.post('/c/s/p', (req, res) => {
    let auth = {
        uType: req.body.uType,
        fname: req.body.fname,
        mname: req.body.mname,
        lname: req.body.lname,
        dob: req.body.dob,
        gender: req.body.gender,
        contact: req.body.contact,
        address: req.body.address,
        cName: req.body.cName,
        cAddress: req.body.cAddress,
        cContact: req.body.cContact,
        prc: req.body.prc,
        agreement: req.body.agreement,
        err : {}
    }

    // ============== FOR EMPTY INPUTS
    if(!auth.fname || !auth.mname || !auth.lname) {
        auth.err.fnameErr = !auth.fname ? 'This field is required.' : ''

        auth.err.mnameErr = !auth.mname ? 'This field is required.' : ''

        auth.err.lnameErr = !auth.lname ? 'This field is required.' : ''
        auth.err.error = 'Error'

        res.send(auth.err)

    // ============== FOR EMPTY INPUTS
    } else if(!auth.dob || !auth.gender || !auth.contact || !auth.address) {        
        auth.err.dobErr = !auth.dob ? 'This field is required' : ''

        auth.err.genderErr = !auth.gender ? 'This field is required' : ''

        auth.err.contactErr = !auth.contact ? 'This field is required' : ''

        auth.err.addressErr = !auth.address ? 'This field is required' : ''

        auth.err.error = 'Error'
        res.send(auth.err)

    // ============== FOR DOCTOR EMPTY INPUTS
    } else if ((auth.uType === 'doctor') && (!auth.cAddress || !auth.cContact || !auth.prc)) {

        auth.err.cAddressErr = !auth.cAddress ? 'This field is required' : ''

        auth.err.cContactErr = !auth.cContact ? 'This field is required' : ''

        auth.err.prcErr = !auth.prc ? 'This field is required' : ''

        res.send(auth.err)

    // ============== FOR NOT TERMS AND CONDITON NOT AGREED
    } else if (auth.agreement === 'false') {
        auth.err.agreementErr = auth.agreement === 'false' ? 'You need to agree  our Terms and Condition' : ''
        res.send(auth.err)
    
    // ============== FOR THE SAME PRC LICENSE NUMBER 
    } else if((auth.uType === 'doctor') && (auth.prc)) {
        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')

        ref.once('value', snapshots => {
            let datas = snapshots.val()


            for (data in datas) {
                if (datas[data].uType === 'doctor') {
                    for (key in datas[data]) {
                        if ((datas[data][key].prc === crypto.encrypt(auth.prc)) && (datas[data][key].verified === false)) {
                            auth.err.prcErr = 'PRC License already exist'
                        }
                    }
                }
            }

            // Updating Doctor Data
            if(auth.err.prcErr) {
                res.send(auth.err)
            } else {
                const userRef = ref.child(req.session.ussID)
                userRef.update({
                    basicInfo: {
                        fname: auth.fname,
                        mname: auth.mname,
                        lname: auth.lname,
                        dob: auth.dob,
                        gender: auth.gender,
                        contact: auth.contact,
                        address: auth.address,
                        profile: 'dadb69977493f06e0fd31a023cb0c632',
                        bio: '',
                        prc: crypto.encrypt(auth.prc),
                    },
                    clinics: {
                        0: {
                            lat: 0,
                            long: 0,
                            map: '',
                            name: auth.cName,
                            address: auth.cAddress,
                            contact: [auth.cContact],
                            assisstantName: '',
                            schedules: {
                                from: {
                                    0: '',
                                    1: '',
                                    2: '',
                                    3: '',
                                    4: '',
                                    5: '',
                                    6: ''
                                }, 
                                to: {
                                    0: '',
                                    1: '',
                                    2: '',
                                    3: '',
                                    4: '',
                                    5: '',
                                    6: ''
                                }
                            }
                        }
                    },
                    appointments: [0],
                    patientFiles: [0],
                    specialty: [0],
                    messages: [0],
                    notifs: [0
                        // {
                        //     from: 'Auxilium Team',
                        //     message: 'We are still verifying your account. Some features of Auxilium is restricted until we fuck ya!',
                        //     date: new Date(),
                        //     type: 'message',
                        //     status: 'new'
                        // }
                    ],
                    uType: auth.uType,
                    status: {
                        profileComplete: true,
                        adminVerified: false
                    }
                }, err => {
                    if (!err)
                        res.send(auth.err)
                    else {
                        auth.err.fireError = err ? 'An error occur' : ''
                    }
                })
            }
        })
    } else if(auth.uType === 'patient'){
        auth.err.error = ''

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')
        const userRef = ref.child(req.session.ussID)
        userRef.update({
            basicInfo: {
                fname: auth.fname,
                mname: auth.mname,
                lname: auth.lname,
                dob: auth.dob,
                gender: auth.gender,
                contact: auth.contact,
                address: auth.address,
                profile: 'dadb69977493f06e0fd31a023cb0c632',
                bio: '',
            },
            appointments: [0],
            messages: [0],
            notifs: [0],
            uType: auth.uType,
            status: {
                complete: true
            }
        }, err => {
            if (!err)
                res.send(auth.err)
            else {
                auth.err.fireError = err ? 'An error occur' : ''
            }
        })
    }
})

module.exports = router