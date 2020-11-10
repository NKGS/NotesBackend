const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
global._ = require('lodash')

require('dotenv').config()

const app = express()
const mongodb = require('./config/mongoDbConn')

app.use((req, res, next) => {
    bodyParser.json({ limit: '50mb' })(req, res, err => {
        if (err) {
            console.error(err)
            let errObj = {
                code: 400,
                status: 'fail',
                message: 'Invalid/Bad Request'
            }
            return res.send(errObj)
        }
        next()
    })
})

app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }))
app.use(express.static('public/uploads'))

//cors
app.use(function (req, res, next) {
    res.removeHeader('X-Powered-By')
    next()
})

app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:3000']
    var origin = req.headers.origin
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, UPDATE, DELETE, PATCH, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,endPoint, userid, authToken, appid, appToken, deviceType, responsetype, data')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Content-Type', 'application/json')
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    return next()
})


app.use(expressValidator())

global.__basedir = __dirname

// ping api to check application status
app.get('/ping', (req, res) => res.send('Hello World'))

// route to router.js file
app.use('/api/v1', require('./router'))

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`app listening on ${port} port!!`))