const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "https://tleliteracy.com/wp-content/uploads/2017/02/default-avatar.png"
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  invites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'calendars'
    }
  ]
})

const User = mongoose.model('users', userSchema)

module.exports = User