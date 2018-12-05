const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const indexRoutes = require('./routes/indexRoutes')
const profileRoutes = require('./routes/profileRoutes')
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use('/', indexRoutes)
app.use('/profile', profileRoutes)
app.get('*', (req, res) => res.send('Invalid URL!'))

io.on('connection', socket => {
    socket.on('submitAppointment', (data) => {
        console.log(data)
    })
})

http.listen(PORT)