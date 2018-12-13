const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const helmet = require('helmet')
const session = require('express-session')
const path = require('path')
const indexRoutes = require('./routes/indexRoutes')
const profileRoutes = require('./routes/profileRoutes')
const PORT = process.env.PORT || 3000


app.use(helmet())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('trust proxy', 1)
app.use(session({
    secret: 'f25fae2cbf2458d6f62c80f162cb14e43b202f0b9d9d9fa2dc62e829ed3190d9',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

io.on('connection', socket => {
    socket.on('submitAppointment', data => {
        io.emit('submitAppointment', data)
    })

    socket.on('chatSend', data => {
        io.emit('chatSend', data)
    } )
})

app.use('/', indexRoutes)
app.use('/u', profileRoutes)
app.get('*', (req, res) => res.send('Invalid URL!'))

http.listen(PORT)