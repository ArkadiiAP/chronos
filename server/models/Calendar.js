const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['secondary', 'primary'],
    default: 'secondary'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  color: {
    type: String,
    default: "green"
  },
  shared: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  ]
})

const Calendar = mongoose.model('calendars', calendarSchema)

module.exports = Calendar