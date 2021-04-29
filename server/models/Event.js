const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['task', 'reminder', 'holiday']
  },
  color: {
    type: String,
    required: true,
    default: 'green'
  },
  start: {
    type: Date
  },
  end: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  calendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'calendars'
  },
  invites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  ]
})

const Event = mongoose.model('events', eventSchema)

module.exports = Event