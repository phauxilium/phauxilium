const express = require('express')
const validator  = require('validator')
const FireAdmin = require('../my_modules/FireAdmin')
const router = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const sgMail = require('@sendgrid/mail');
const SendGrid = require('../my_modules/SendGrid')

router.get('/', (req, res) => res.render('index/index'))

router.get('/about', (req, res) => res.render('index/about'))

router.get('/contact', (req, res) => res.render('index/contact'))

//  --------------- Initializing FireAdmin
const fire = new FireAdmin()

// ----------------------- Sign in ------------------
router.post('/signin', (req, res) => {
    let auth = {
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        err: {
            emailErr: '',
            passwordErr: ''
        }
    }

    if(auth.email === '' || auth.password === '') {
        if(auth.email === '')
            auth.err.emailErr = 'Can\'t be empty'

        if(auth.password === '')
            auth.err.passwordErr = 'Can\'t be empty'

        res.send(auth.err)
    }
    // } else if(!validator.isEmail(auth.email)) {
    //     auth.emailErr = 'Invalid email'
    //     res.send(auth)
    // } 
    else {
        const db = fire.firebase.database()
        const ref = db.ref('users')

        ref.orderByKey().equalTo(auth.email).on('value', snapshots => {
            let datas = snapshots.val()
            if (datas === null) {
                auth.err.emailErr = 'Invalid email'
            } else {
                if (auth.password !== datas[auth.email].name)
                    auth.err.passwordErr = 'Invalid Password'
                else
                    auth.email = crypto.encrypt(auth.email)

                    req.session.ussID = auth.email
            }
            res.send(auth.err)

        })
    }
})



//  --------------------- Signup ----------------------
router.post('/signup', (req, res) => {
    const db = fire.firebase.database()
    const ref = db.ref('users')

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


    ref.orderByKey().equalTo(auth.email).on('value', snapshots => {
        
        if(!validator.isEmail(auth.email)) {
            auth.err.emailErr = 'Invalid email address'
        } else if (auth.email) {
            auth.err.emailErr = snapshots.val() ? auth.err.emailErr = 'Email already exist' : '' 
        } else {
            auth.err.emailErr = 'Email can\'t be empty'
        }

        auth.err.passwordErr = auth.password.length < 8 ? 'Password must not be less than 8 characters' : ''

        auth.err.cpasswordErr = auth.password !== auth.cpassword ? 'Password doesn\'t match' : ''

        if (!auth.err.emailErr && !auth.err.passwordErr && !auth.err.cpasswordErr) {
            let random1 = Math.ceil(Math.random() * 1000 + 500)
            let random2 = Math.floor(Math.random() * 2000 + 300)

            req.session.evcode = `${random1}${random2}`

            // TODO
            // ---------- Send grid API ------------
            let mail = new SendGrid()
            sgMail.setApiKey(mail.getAPI());
            mail.setMail(
                auth.email,
                `<h3>You're verification code is</h3> <h2><u style="color:blue">${ req.session.evcode }</u></h2>`
            )

            let message = mail.getMail()

            sgMail.send(message)
            .then(() => {
                res.send(auth)
            })
            .catch((err) => {
                if(err)
                    auth.err.sendFailed = 'An error occur'
                    res.send(auth.err)
            })
        } else {
            res.send(auth.err)
        }
    })
})

// ----------- Account Verification ----------------
router.post('/e/v', (req, res) => {
    let auth = {
        code: req.body.code,
        err: {
            codeErr: ''
        }
    }

    auth.err.codeErr = auth.code !== req.session.evcode ? 'Invalid code' : req.session.destroy()

    res.send(auth.err)
})

module.exports = router