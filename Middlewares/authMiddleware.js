const LogoutModel = require("../Models/logoutModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(400).send({msg : 'Token not found!'});
    }

    const logoutToken = await LogoutModel.findOne({token});
    if(logoutToken){
        return res.status(400).send({msg : 'Token revoked!'})
    }

    jwt.verify(token, process.env.secretKey, async(err, decoded) => {
        if(err){
            res.status(400).send({msg : 'Invalid token!'})
        }
        else{
            req.body.author = decoded.author;
            req.body.userName = decoded.userName;
            next();
        }
    })
}

module.exports = auth;