const { validationResult } = require('express-validator/check')

const errorResponse = require('../helper/formatResponse').errorFormat
const errorCodeJson = require('../config/errorCode/errorCode')

const checkValidationResult = (req, res, next) => {
  const result = validationResult(req)
  if (result.isEmpty()) {
    return next()
  }
  const errorArray = result.array().map((ele) => {
    if (Object.prototype.hasOwnProperty.call(errorCodeJson, ele.msg)) {
      return {
        code: ele.msg,
        message: errorCodeJson[ele.msg]
      }
    } else {
      return {
        code: 'err_001',
        message: 'Generic Error'
      }
    }
  })

  res.status(422).send(errorResponse('fail', 'Invaild Request', {}, errorArray))
}

module.exports = { checkValidationResult }
