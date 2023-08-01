const User = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const {StatusCodes} = require('http-status-codes')


exports. register = async (req, res) => {
    
const user = await User.create({...req.body})
const token = user.createJWT()
res.status(StatusCodes.CREATED).json({user: {name: user.name} , token})
 }
 
 exports. login = async (req, res) => {
    const {password, email} = req.body
    if(!password || !email){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    
    if(!user){
        throw new UnauthenticatedError('Unvalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Unvalid password')
    }
    const token = user.createJWT()

    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
 }
