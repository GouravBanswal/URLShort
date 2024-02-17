const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const User = require("../models/User")

exports.register = asyncHandler(async(req,res) => {
      const {name, email, password} = req.body
      if(!validator.isEmail(email)){
        return res.status(400).json({message: "please provide valid email"})
      }
      if(!validator.isStrongPassword(password)){
        //Skillhub@123
        return res.status(400).json({message: "please provider valid password"})
    }
    if(!name){
        return res.status(400).json({message: "please provider name"})
    }
    const result = await User.findOne({email})
    if(result){
        return res.status(400).json({message: "email already in use"})
    }
    // if(!result.active){
    //     return res.status(400).json({message: "Account Blockes . get in touch with admin"})
    // }

    const hashPass = await bcrypt.hash(password, 10)
    await User.create({...req.body, password: hashPass})
    res.status(201).json({message: "user register success"})
})
exports.login = asyncHandler(async(req,res) => {
     const {email, password} = req.body
     if(!email || !password){
       return res.status(400).json({message: "email and passord required"})
     }
     if(!validator.isEmail(email)){ 
        return res.status(400).json({message: "please provide valid email"})
     }
     if(!validator.isStrongPassword(password)){
        return res.status(400).json({message: "please provider valid password"})
      }

      const result = await User.findOne({email})
      if(!result){
        return res.status(400).json({message: "email not registerd with us"})
      }


      if(!result.active){
        return res.status(400).json({message: "Account Blocked, Get in touch with admin"})
    }
    
    const varify = bcrypt.compare(password, result.password)
    
    if(!varify){
          return res.status(400).json({message: "password do not match"})
      }

      const token = jwt.sign({userId: result._id}, process.env.JWT_KEY,{expiresIn: "1d"})
      res.cookie("devAuth", token, {maxAge : 3600000 * 6})

      res.status(200).json({
        message: "login success",
        result: {
            name: result.name,
            email: result.email,
            role: result.role
        }
      })
})

exports.logout = asyncHandler(async (req,res) => {
    res.clearCookie("devAuth")
    res.status(200).json({message: "logout success"})
})



