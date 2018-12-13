const express = require('express')
const firebaseAdmin = require('../my_modules/firebaseAdmin')
const router = express.Router()
const firebase = new firebaseAdmin()
const Cryptos = require('../my_modules/cryptos')
const crypto = new Cryptos()

firebase.fireAdmin
firebase.fireConnect()

router.get('/', (req, res) => res.render('index/index'))

router.get('/about', (req, res) => res.render('index/about'))

router.get('/contact', (req, res) => res.render('index/contact'))

router.post('/signin', (req, res) => {
    let auth = {
        email: req.body.email,
        password: req.body.password,
        emailErr: '',
        passwordErr: ''
    }

    const db = firebase.firebase.database()
    const ref = db.ref('users')

    ref.orderByKey().equalTo(auth.email).on('value', snapshot => {
        let datas = snapshot.val()
        if(datas === null) {
            auth.emailErr = 'Invalid email'
        } else {
            if(auth.password !== datas[auth.email].name)
                auth.passwordErr = 'Invalid Password'
            else {
                auth.email = crypto.encrypt('kier')
            }
        }

        res.send(auth)

    })

})

module.exports = router