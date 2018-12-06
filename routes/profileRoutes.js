const express = require('express')
const route = express.Router()

let date = new Date()

let weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let getDay = date.getDay() - 1
let getDate = date.getDate()
let getMonth = date.getMonth()
let getYear = date.getFullYear()

const person = {
    person1: {
        uname: 'kier',
        name: 'Gerphil Kier De la Cruz',
        img: 'ker.jpg',
        specialty: 'Pediatrics/ Developmental and Behavioral Pediatrics',
        since: 'MD since 2004',
        practice: 'I am a developmental and behavioral pediatrician. My practice deals with developmental and behavioral concerns of children such as ADHD, autism, learning disability, intellectual disability and the like. I also do school assessment to help children and their parents find better placement for them in terms of education.',
        clinic_name: 'M. Francisco Children\'s Medical Clinic',
        clinic_loc: '497 F. Mariano Ave, Manggahan, Pasig City, Metro Manila',
        clinic_phone: 'Tel No.:  (632)6817158 / 09154524372',
        schedules: {
            Monday: '9:00am - 2:00pm',
            Tuesday: '9:00am - 2:00pm',
            Wednesday: '5:00pm - 7:00pm',
            Thursday: '9:00am - 2:00pm',
            Friday: '5:00pm - 7:00pm',
            Saturday: '9:00am - 2:00pm'
        },
        appointments: {
            today: {
                '9:00am': 'Paul Joseph Tiquio',
                '9:30am': 'Vinoe Saison',
                '1:00pm': 'Atena Daylisan'
            },
            upcoming: {}
        },
        medRecords: {},
        doctor: true
    },
    
    person2: {
        uname: 'paul',
        name: 'Paul Joseph Tiquio',
        img: 'tiquio.jpg',
        address: 'Mandurriao, Iloilo City',
        appointments: {
            today: {
                '3:30pm': 'Jhon Michael Gonzales'
            },
            upcoming: {}
        },
        medRecords: {},
        doctor: false
    },
    
    person3: {
        uname: 'mike',
        name: 'Jhon Michael Gonzales',
        img: 'gonz.jpg',
        specialty: 'Internal Medicine/ Pulmonology',
        since: 'MD since 1982',
        practice: 'Dr. Corona S. Seña practices Internal Medicine and specializes in Pulmonology. A doctor since 1982, Dr. Seña\'s expertise are in disease areas that include Bronchial Asthma. Our doctor treats patients at Sabal Hospital, Inc. in Cagayan De Oro City. Patients are accepted by appointment. You can request for an appointment by calling the clinic numbers provided. See clinic schedule below.',
        clinic_name: 'Sabal Hospital, Inc., Room 228',
        clinic_loc: '292 Don A. Velez St., Cagayan De Oro City, Misamis Oriental',
        clinic_phone: 'Tel No.:  (088)8561944 / 8562619 / 8562611',
        schedules: {
            Monday: '11:00am - 5:00pm',
            Tuesday: '2:00pm - 5:00pm',
            Wednesday: '11:00am - 5:00pm',
            Thursday: '2:00pm - 5:00pm',
            Friday: '11:00am - 5:00pm',
            Saturday: '9:00am - 2:00pm'
        },
        appointments: {
            today: {
                '11:00am': 'Atena Daylisan',
                '2:00pm': 'Vinoe Saison',
                '3:30pm': 'Paul Joseph Tiquio'
            },
            upcoming: {}
        },
        medRecords: {},
        doctor: true
    },

    person4: {
        uname: 'vinoe',
        name: 'Vinoe Ladisla Saison',
        img: 'bin2.jpg',
        address: 'Lapuz Norte, Iloilo City',
        appointments: {
            today: {
                '9:30am': 'Gerphil Kier De la Cruz',
                '2:00pm': 'Jhon Michael Gonzales'
            },
            upcoming: {}
        },
        medRecords: {
            'John Michael Gonzales': {
                'Wednesday, December 5, 2018 - 9:30am': {
                    findings: 'Lung Cancer'
                }
            },

            'Gerphil Kier De la Cruz': {
                'Monday, December 3, 2018 - 10:30am': {
                    findings: 'Asthma'
                }
            }


        },
        doctor: false
    },

    person5: {
        uname: 'ateng',
        name: 'Atena Daylisan',
        img: 'ateng.jpg',
        address: 'Q. Abeto St. Mandurriao, Iloilo City',
        appointments: {
            today: {
                '11:00am': 'Jhon Michael Gonzales',
                '1:00pm': 'Gerphil Kier De la Cruz',
            },
            upcoming: {}
        },
        doctor: false
    },

}



route.get('/t/:name', (req, res) => {
    let data;
    let uname = req.params.name
    if(uname === 'kier') data = person.person1
    else if (uname === 'paul') data = person.person2
    else if(uname === 'mike') data = person.person3
    else if(uname === 'vinoe') data = person.person4
    else if(uname === 'atena') data = person.person5
    else res.send('Invalid URL!')

    res.render('profile/timeline', {
        data,
        'weeks': weeks,
        'dateNow': `${weeks[getDay]} - ${months[getMonth]} ${getDate}, ${getYear}`
    })
    
})

module.exports = route