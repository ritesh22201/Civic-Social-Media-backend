const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const validator = require('../Middlewares/validator');
const UserModel = require('../Models/userModel');
const LogoutModel = require('../Models/logoutModel');
const auth = require('../Middlewares/authMiddleware');

userRouter.get('/',auth ,async(req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

userRouter.post('/register', validator, async(req, res) => {
    const {password} = req.body;

    try {
        const newPass = await bcrypt.hash(password, 10);
        const user = await UserModel.create({...req.body, password : newPass});
        res.status(200).send({msg : 'User registered successfully', user});
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

userRouter.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(400).send({msg : 'User not found!'});
        }
        else{
            const verifiedPass = await bcrypt.compare(password, user.password);
            if(!verifiedPass){
                res.status(400).send({msg : 'Wrong Password!'})
            }
            else{
                const token = jwt.sign({author : user._id, userName : user.name}, process.env.secretKey, {expiresIn : '1d'});
                res.status(200).send({msg : 'User loggedIn successfully', token, userName : user.name});
            }
        }
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

userRouter.get('/logout', async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        if(!token){
            res.status(400).send({msg : 'Login first!'});
        }
        else{
            const logoutUser = await LogoutModel.create({token});
            res.status(200).send({msg : 'User logged out successfully'});
        }
    } catch (error) {
        res.status(400).send({msg : error.message});
    }
})

module.exports = userRouter;