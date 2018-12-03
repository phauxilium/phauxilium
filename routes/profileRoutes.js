const express = require('express')
const route = express.Router()

let date = new Date()

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let getDate = date.getDate()
let getMonth = date.getMonth() - 1
let getYear = date.getFullYear()

route.get('/', (req, res) => res.render('profile/timeline', 
{   
    'month': months[getMonth],
    'day': getDate,
    'year': getYear
}))


module.exports = route