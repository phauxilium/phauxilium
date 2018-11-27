const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.render('index/index'))

router.get('/about', (req, res) => res.render('index/about'))

router.get('/contact', (req, res) => res.render('index/contact'))

router.get('*', (req, res) => res.send('Invalid URL'))

module.exports = router