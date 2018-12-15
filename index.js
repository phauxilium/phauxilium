const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const helmet = require('helmet')
const session = require('express-session')
const path = require('path')
const FireAdmin = require('./my_modules/FireAdmin')
const Session = require('./my_modules/Configs')
const indexRoutes = require('./routes/indexRoutes')
const profileRoutes = require('./routes/profileRoutes')
const PORT = process.env.PORT || 3000

const firebase = new FireAdmin()
firebase.fireConnect()

app.use(helmet())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

const sess = new Session()
if(app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sess.state.session.cookie.secure = true
}
app.use(session(sess.getSession()))

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