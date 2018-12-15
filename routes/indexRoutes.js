const express = require('express')
const validator  = require('validator')
const FireAdmin = require('../my_modules/FireAdmin')
const router = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()

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
        emailErr: '',
        passwordErr: ''
    }

    if(auth.email === '' || auth.password === '') {
        if(auth.email === '')
            auth.emailErr = 'Can\'t be empty'

        if(auth.password === '')
            auth.passwordErr = 'Can\'t be empty'

        res.send(auth)
    } else {
        const db = fire.firebase.database()
        const ref = db.ref('users')

        ref.orderByKey().equalTo(auth.email).on('value', snapshots => {
            let datas = snapshots.val()
            if (datas === null) {
                auth.emailErr = 'Invalid email'
            } else {
                if (auth.password !== datas[auth.email].name)
                    auth.passwordErr = 'Invalid Password'
                else
                    auth.email = crypto.encrypt(auth.email)
            }
            res.send(auth)
        })
    }
})

//  --------------------- Signup ----------------------
router.post('/signup', (req, res) => {
    let auth = {
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
        emailErr: '',
        passwordErr: '',
        cpasswordErr: ''
    }

    auth.emailErr = !validator.isEmail(auth.email) ? 'Invalid email' : auth.emailErr = ''

    auth.passwordErr = auth.password.length < 8 ? passwordErr = 'Password must not be less than 8 characters' : ''

    auth.cpasswordErr = auth.password !== auth.cpassword ? 'Password doesn\'t match' : ''

    res.send(auth)
})

module.exports = router