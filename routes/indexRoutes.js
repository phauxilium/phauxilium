const express = require('express')
const validator  = require('validator')
const FireAdmin = require('../my_modules/FireAdmin')
const router = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const SendGrid = require('../my_modules/SendGrid')

router.get('/', (req, res) => res.render('index/index'))

router.get('/about', (req, res) => res.render('index/about'))

router.get('/contact', (req, res) => res.render('index/contact'))

//  --------------- Initializing FireAdmin

// ----------------------- Sign in ------------------
router.post('/signin', (req, res) => {
    let auth = {
        email: req.body.email,
        password: req.body.password,
        err: {
            emailErr: '',
            passwordErr: ''
        }
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
        const encryptEmail = crypto.encrypt(auth.email)
        ref.orderByKey().equalTo(encryptEmail).once('value', snapshots => {
            let datas = snapshots.val()
            if (datas === null) {
                auth.err.emailErr = 'Invalid email'
                res.send(auth.err)
            } else {
              if (crypto.encrypt(auth.password) !== datas[encryptEmail].password) {
                  res.send(auth.err)
                  auth.err.passwordErr = 'Invalid password'
              }else {
                  auth.email = crypto.encrypt(auth.email)
                  req.session.ussID = auth.email
                  if(datas[encryptEmail].complete === false) {
                      auth.err.completeFailed = true
                      res.send(auth.err)
                  } else {
                      res.send(auth.err)
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
        err: {
            emailErr: '',
            passwordErr: '',
            cpasswordErr: '',
            sendFailed: ''
        }
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
        ref.orderByKey().equalTo(crypto.encrypt(auth.email)).once('value', snapshots => {
            if(snapshots.val() === null) {

                if (!auth.err.emailErr && !auth.err.passwordErr && !auth.err.cpasswordErr) {
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
                    res.send(auth.err)
                }
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
            email: crypto.encrypt(req.session.evemail),
            password: crypto.encrypt(req.session.evpassword)
        }

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')

        const userRef = ref.child(auth.email)
        userRef.set({
            password: auth.password,
            complete: false
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


//  TODO
//  MAKE BOTH PATIENT AND DOCTOR SIGNUP`
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
        err : {
            uTypeErr: '',
            fnameErr: '',
            mnameErr: '',
            lnameErr: '',
            dobErr: '',
            genderErr: '',
            contactErr: '',
            addressErr: '',
            error: ''
        }
    }

    if(!auth.fname || !auth.mname || !auth.lname) {
        auth.err.fnameErr = !auth.fname ? 'This field is required.' : ''

        auth.err.mnameErr = !auth.mname ? 'This field is required.' : ''

        auth.err.lnameErr = !auth.lname ? 'This field is required.' : ''
        auth.err.error = 'Error'

        res.send(auth.err)
    } else if(!auth.dob || !auth.gender || !auth.contact || !auth.address) {        
        auth.err.dobErr = !auth.dob ? 'This field is required' : ''

        auth.err.genderErr = !auth.gender ? 'This field is required' : ''

        auth.err.contactErr = !auth.contact ? 'This field is required' : ''

        auth.err.addressErr = !auth.address ? 'This field is required' : ''

        auth.err.error = 'Error'
        res.send(auth.err)

    }else {
        auth.err.error = ''

        const fire = new FireAdmin()
        const db = fire.firebase.database()
        const ref = db.ref('users')
        const userRef = ref.child(req.session.ussID)
        userRef.update({
            uType: auth.uType,
            fname: auth.fname,
            mname: auth.mname,
            lname: auth.lname,
            dob: auth.dob,
            gender: auth.gender,
            contact: auth.contact,
            address: auth.address,
            complete: true
        }, err => {
            if(!err)
                    res.send(auth.err)
            else {
                auth.err.fireError = err ? 'An error occur' : ''
            }
        })
    }
})

module.exports = router