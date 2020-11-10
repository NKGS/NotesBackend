const bcrypt = require(`bcrypt`)
const apiResponse = require(`../../helper/formatResponse`)
const errorCode = require(`../../config/errorCode/errorCode`)
const errorResponse = require(`../../helper/errorResponse`).errorResponse
const UserModel = require(`../../model/users/users_model`)

class Signup {
    async saveUser(data) {
        try {
            const query = { emailId: data.emailId }
          
            const { emailId, password } = data;
            const userData = await UserModel.findOne(query,'emailId', function (err, val) {
                if (err) {
                    console.log(err)
                    console.log('nikitaa')
                }
              })

            console.log('userData - ',userData)
            //!_.isEmpty(userData)
            if (!userData) {
                const User = new UserModel({emailId, password})
                const salt = await bcrypt.genSalt(10)
                User.password = await bcrypt.hash(data.password, salt)
                await User.save()
                //const saveData = await UserModel.create(data)
                console.log('User does not exist add new')
                return
            } 

            let errorObj = {
                code: `err_001`,
                message: errorCode.err_001
            }

            if(userData && !_.isEmpty(userData)) {
                console.log('in user existsssss!!!')
                errorObj.message = errorCode.err_002
                errorObj.code=500
            }

            throw (apiResponse.errorFormat(`fail`, errorCode.err_001, {}, [errorObj], 500))
        } catch (error) {
            console.log(error)
            return Promise.reject(error)
        }
    }
}
const signUp = async (req, res) => {
    try {
        const data = req.body
        const signUpCls = new Signup()
        await signUpCls.saveUser(data)
        res.status(200).send({ status: `success`, message: `User signUp successfully`, data: {}, error: [] })
    } catch (error) {
        console.log(`error ${error}`)
        console.log(`err ${JSON.stringify(error)}`)
        const code = (Object.prototype.hasOwnProperty.call(error, 'status')) ? error.code : 500
        const response = errorResponse(error)
        res.status(code).send(response)
    }
}

module.exports = { signUp }