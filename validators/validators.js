const { check } = require('express-validator/check')

const validate = (method) => {
    console.log('method - ',method)
    switch(method) {
        case `signup`: {
            return [
                check(`emailId`, `err_003`).isEmail(),
                check(`password`, `err_004`).isLength({
                    min: 6,
                    max:15
                })
            ]
        }
        case `signIn`: {
            return [
                check(`emailId`, `err_003`).isEmail(),
                check(`password`, `err_004`).isLength({
                    min: 6,
                    max:15
                })
            ]
        }
        default: {
            return []
        }
    }
}

module.exports = { validate }