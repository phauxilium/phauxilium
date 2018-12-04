const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const indexRoutes = require('./routes/indexRoutes')
const profileRoutes = require('./routes/profileRoutes')
const PORT = process.env.PORT || 3000
const app = express()

app.use(helmet())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use('/', indexRoutes)
app.use('/profile', profileRoutes)
app.get('*', (req, res) => res.send('Invalid URL!'))

app.listen(PORT)