const errorResponse = require("../../helper/errorResponse")

const UserModel = require(`../../model/users/users_model`)
const apiResponse = require(`../../helper/formatResponse`)
const errorCode = require(`../../config/errorCode/errorCode`)
const bcrypt = require(`bcrypt`)
const jwt = require("jsonwebtoken")

class SignIn {
    async login(data) {
        try {
            const { password } = data;
            const query = { emailId: data.emailId }
            const userData = await UserModel.findOne(query)
            if (!userData) {
                let errorObj = {
                    code: `err_002`,
                    message: errorCode.err_002
                }
                throw (apiResponse.errorFormat(`fail`, errorCode.err_002, {}, [errorObj], 500))
            }

            const isMatch = await bcrypt.compare(password, userData.password);
            if (!isMatch) {
                let errorObj = {
                    code: `err_004`,
                    message: errorCode.err_004
                }
                throw (apiResponse.errorFormat(`fail`, errorCode.err_004, {}, [errorObj], 500))
            }

            const payload = {
                user: { id: userData.id }
            }

            return payload
        } catch (error) {
            console.log(`errror - ${error}`)
        }
    }

    async generateAwtToken(payload) {
        return new Promise((resolve, reject) => {
            try {
                jwt.sign(
                    payload,
                    process.env.RAND_STR,
                    {
                        expiresIn: 100000
                    },
                    (err, token) => {
                        console.log('token - ', token)
                        if (err) reject(err);
                        else resolve(token)
                    }
                );
            } catch (e) {
                resolve(e)
            }
        });
    }
}

const signIn = async (req, res) => {
    try {
        const data = req.body
        console.log('data - ',data)
        const signInCls = new SignIn()
        const tokenRes = await signInCls.login(data)
        console.log(tokenRes)

        const generateToken = await signInCls.generateAwtToken(tokenRes)
        console.log(`res  - ${generateToken}`)
        res.status(200).send({ status: `success`, message: `User signin successful`, data: generateToken, error: [] })
    } catch (e) {
        console.log(`error - ${e}`)
        const code = (Object.prototype.hasOwnProperty.call(e, 'status') ? e.code : 500)
        const response = errorResponse(e)
        res.status(code).send(response)
    }
}

module.exports = { signIn }