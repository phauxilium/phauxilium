const express = require('express')
const route = express.Router()
const Cryptos = require('../my_modules/Cryptos')
const crypto = new Cryptos()
const FireAdmin = require('../my_modules/FireAdmin')
const fire = new FireAdmin()

// ------------- Profile route --------------
route.get('/t/', (req, res) => {
    let sessionID = req.session.ussID
    if(sessionID === undefined) {
        res.redirect('/')
    } else {
        crypto.decrypt(sessionID, (err, decrypted) => {
            err ? res.send(err) : res.send(decrypted)
        })
    }
})

route.get('/s/o', (req, res) => {
    if(req.session.ussID) {
        req.session.destroy(err => {
            if(!err)
                res.send('Destroyed')
        })
    } else 
        res.redirect('/')

})


module.exports = route