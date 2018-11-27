const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const indexRoutes = require('./routes/indexRoutes')
const PORT = process.env.PORT || 3000
const app = express()

app.use(helmet())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use('/', indexRoutes)

app.listen(PORT)