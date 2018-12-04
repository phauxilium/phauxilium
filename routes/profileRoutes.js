const express = require('express')
const route = express.Router()

let date = new Date()

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let getDate = date.getDate()
let getMonth = date.getMonth() - 1
let getYear = date.getFullYear()

const person = {
    person1: {
        name: 'Gerphil Kier De la Cruz',
        img: 'ker.jpg',
        doctor: true
    },
    
    person2: {
        name: 'Paul Joseph Tiquio',
        img: 'tiquio.jpg',
        address: 'Mandurriao, Iloilo City',
        doctor: false
    }
}


route.get('/t/:name', (req, res) => {
   let uname = req.params.name
   if(uname === 'kier') {
    res.render('profile/timeline', 
    {   
        'name': person.person1.name,
        'img': person.person1.img,
        'doctor': person.person1.doctor,
        'month': months[getMonth],
        'day': getDate,
        'year': getYear
    })
   } else if (uname === 'paul') {
    res.render('profile/timeline', 
    {   
        'name': person.person2.name,
        'img': person.person2.img,
        'address': person.person2.address,
        'doctor': person.person2.doctor,
        'month': months[getMonth],
        'day': getDate,
        'year': getYear
    })
   }
})

module.exports = route