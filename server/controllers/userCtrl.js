const User = require('../models/User')
const bcrypt = require('bcrypt')

const userCtrl = {
  getUserById: async (req, res) => {
    try{
      const user = await User.findOne({_id: req.params.user_id}, {password: 0})
      if(!user){
        return res.status(404).json({msg: "User with this id doesn't exist"})
      }
      return res.status(200).json(user)
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  updateUser: async (req, res) => {
    try{
      const {password, cf_password} = req.body
      const isMatch = password === cf_password
      if(isMatch){
        const passwordHash = await bcrypt.hash(password, 12)
        const user = await User.findByIdAndUpdate({_id: req.user._id}, {password: passwordHash})
        if(!user){
          return res.status(404).json({msg: "User not found"})
        }
        return res.status(200).json({msg: "Account updated"})
      } else {
        return res.status(400).json({msg: "Passwords do not match"})
      }
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  changeAvatar: async (req, res) => {
    try{
      if (req.file) {
        const user = await User.findByIdAndUpdate({_id: req.user._id}, {avatar: `http://localhost:5000/${req.file.filename}`})
        if(!user) {
          return res.status(404).json({msg: "User not found"})
        } else {
          return res.status(200).json({msg: "Avatar updated"})
        }
      }
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  getAllUsers: async (req, res) => {
    try{
      const users = await User.find({}, {password: 0})
      return res.status(200).json(users)
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  }
}

module.exports = userCtrl