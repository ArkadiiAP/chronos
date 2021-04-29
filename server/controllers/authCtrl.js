const User = require('../models/User')
const bcrypt = require("bcrypt")
const sendMail = require('./sendMail')
const jwt = require('jsonwebtoken')
const Calendar = require('../models/Calendar')

const authCtrl = {
  register: async (req, res) => {
    try {
      const {name, email, password} = req.body
      console.log(req.session)
      if(!name || !email || !password){
        return res.status(400).json({msg: "Please fill in all fields"})
      }
      if(!validateEmail(email)){
        return res.status(400).json({msg: "Invalid email"})
      }
      let user = await User.findOne({email: email})
      if(user){
        return res.status(400).json({msg: "This email already exist"})
      } else {
        user = await User.findOne({name: name})
        if(user){
          return res.status(400).json({msg: "This name already exist"})
        }
      }
      if(password.length < 6){
        return res.status(400).json({msg: "Password must be at list 6 characters"})
      }
      const passwordHash = await bcrypt.hash(password, 12)
      const newUser = {
        name,
        email,
        password: passwordHash
      }
      const activation_token = createActivationToken(newUser);
      const mailOptions = {
        to: req.body.email,
        subject: "Confirm email",
        text: `http://localhost:3000/activation/${activation_token}`
      }
      sendMail(mailOptions)
      res.status(200).json({
        msg: "Register success! Please activate your email"
      })
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  activateEmail: async (req, res) => {
    try {
      const {activation_token} = req.body
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      )
      const {name, email, password} = user
      let check = await User.findOne({email: email})
      if(check){
        return res.status(400).json({msg: "This email already exist"})
      }else {
        check = await User.findOne({name: name})
        if(check){
          return res.status(400).json({msg: "This name already exist"})
        }
      }
      const newUser = await User.create({
        name,
        email,
        password
      })
      await Calendar.create({
        title: 'Main Calendar',
        type: 'primary',
        user: newUser._id
      })
      return res.status(201).json({msg: "Account has been activated"})
    }
    catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  login: (req, res) => {
    try{
      return res.status(200).json({msg: "Login successful"})
    } catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const {email} = req.body
      const user = await User.findOne({email: email})
      if(!user){
        return res.status(400).json({msg: "This email does not exist"})
      }
      const activation_token = createActivationToken({id: user._id})
      const mailOptions = {
        to: req.body.email,
        subject: "Reset password",
        text: `http://localhost:3000/resetPassword/${activation_token}`
      }
      sendMail(mailOptions)
      return res.status(200).json({msg: "Re-send the password, please check your email."})
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  resetPassword: async (req, res) => {
    try{
      const token = req.params.confirm_token
      if(!token){
        return res.status(404).json({msg: "Invalid authentication"})
      }
      jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET, (err, user) => {
        if(err){
          return res.status(400).json({msg: "Invalid authentication"})
        }
        req.user = user
      })
      const {password} = req.body
      if(password.length < 6){
        return res.status(400).json({msg: "Password must be at list 6 characters"})
      }
      const passwordHash = await bcrypt.hash(password, 12)
      console.log(req.user)
      const user = await User.findOneAndUpdate({_id: req.user.id}, {password: passwordHash})
      if(!user){
        return res.status(404).json({msg: "Ououou"})
      }
      return res.status(200).json({msg: "Password changed successful"})
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  logout: async (req, res) => {
    try {
      await req.logout()
      return res.status(200).json({msg: 'You are logged out'})
    } catch (err){
      return res.status(500).json({msg: err.message})
    }
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '20m'
  })
}

module.exports = authCtrl