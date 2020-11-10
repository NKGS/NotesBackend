const express = require('express')
const router = express.Router()

router.use('/user', require('./routing/basicRoutes.js'))
router.use('/notes', require('./routing/notesRoute.js'))

module.exports = router
