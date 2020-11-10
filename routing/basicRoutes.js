const express = require('express')
const router = express.Router()

const request = require(`../validators/validators`)
const validateResult = require('../helper/validateResult')
const signUp = require('../components/signUp/signUp').signUp
const signIn = require('../components/singIn/signIn').signIn

router.post('/signup', request.validate(`signup`) , validateResult.checkValidationResult, signUp)
router.post('/signIn', request.validate(`signIn`) , validateResult.checkValidationResult, signIn)

module.exports = router
