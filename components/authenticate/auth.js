const UserModel = require("../../model/users/users_model");

const authenticate = async(req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await UserModel.findById(req.user.id);
        res.json(user);
    }
    catch(e) {
        console.log(`error ${error}`)
        console.log(`err ${JSON.stringify(error)}`)
        const code = (Object.prototype.hasOwnProperty.call(error, 'status')) ? error.code : 500
        const response = errorResponse(error)
        res.status(code).send(response)
    }
}
module.exports = {authenticate}