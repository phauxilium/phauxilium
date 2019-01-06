const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const helmet = require('helmet')
const session = require('express-session')
const path = require('path')
const FireAdmin = require('./my_modules/FireAdmin')
const firebase = new FireAdmin()
firebase.fireConnect()
const Session = require('./my_modules/ExpressSession')
const Cloudinary = require('./my_modules/Cloudinary')
const indexRoutes = require('./routes/indexRoutes')
const profileRoutes = require('./routes/profileRoutes')(io)
const prototypeRoutes = require('./routes/prototypeRoutes')
const addSpecialization = require('./sockets/AddSpecialization')(io)
const PORT = process.env.PORT || 3000

const cloud = new Cloudinary()
cloud.getConfig()

app.use(helmet())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

const sess = new Session()
sess.setSession(app.get('env'))
app.use(session(sess.getSession()))

io.on('connection', socket => {
    socket.on('submitAppointment', data => {
        io.emit('submitAppointment', data)
    })

    socket.on('chatSend', data => {
        io.emit('chatSend', data)
    })
})

app.use('/', indexRoutes)
app.use('/u', profileRoutes)
app.use('/profile', prototypeRoutes)
app.get('*', (req, res) => res.send('Invalid URL!'))
app.post('*', (req, res) => res.send('Invalid URL!'))


http.listen(PORT)