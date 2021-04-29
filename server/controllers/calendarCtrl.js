const Calendar = require('../models/Calendar')
const User = require('../models/User')

const calendarCtrl = {
  getAllCalendars: async (req, res) => {
    try{
      const calendars = await Calendar.find().or([{user: req.user._id}, {shared: req.user._id}])
      if(!calendars){
        return res.status(404).json({msg: "Calendars not found"})
      }
      return res.status(200).json(calendars)
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  createCalendar: async (req, res) => {
    try {
      const {title, color} = req.body
      await Calendar.create({title: title, color: color, user: req.user._id})
      return res.status(201).json({msg: "Calendar created"})
    } catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  deleteCalendar: async (req, res) => {
    try {
      const calendar = await Calendar.findOne({_id: req.params.calendar_id})
      if(calendar.type === 'primary'){
        return res.status(400).json({msg: "Main calendar cannot be deleted"})
      }
      await calendar.deleteOne()
      return res.status(204).json({msg: "Calendar deleted"})
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  updateCalendar: async (req, res) => {
    try {
      const {title, color} = req.body
      await Calendar.findByIdAndUpdate({_id: req.params.calendar_id}, {title: title, color: color})
      return res.status(200).json({msg: "Calendar updated"})
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  shareCalendar: async (req, res) => {
    try{
      const shareArr = [...new Set(req.body.share)]
      console.log(shareArr)
      const calendar_id = req.params.calendar_id
      const calendar = await Calendar.findOne({_id: calendar_id})
      shareArr.map(async elem => {
        const index = calendar.shared.indexOf(elem)
        if(index === -1){
          calendar.shared.push(elem)
        }
        const user = await User.findById({_id: elem}, "invites")
        const index2 = user.invites.indexOf(calendar_id)
        if(index2 === -1){
          user.invites.push(calendar_id)
        }
        await user.save()
      })
      await calendar.save()
      return res.status(200).json({msg: "Calendar shared"})
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  },
  unShareCalendar: async (req, res) => {
    try{
      const calendar = await Calendar.findOne({_id: req.params.calendar_id})
      const index = calendar.shared.indexOf(req.body.user_id)
      if(index > -1) {
        calendar.shared.splice(index, 1)
        await calendar.save()
        const user = await User.findById(req.body.user_id)
        const index2 = user.invites.indexOf(req.params.calendar_id)
        if(index2 > -1) {
          user.invites.splice(index2, 1)
          await user.save()
        }
        return res.status(200).json({msg: "User deleted from this calendar"})
      }
      return res.status(400).json({msg: "Calendar is not share for this user"})
    }catch (err){
      return res.status(500).json({msg: err.message})
    }
  }
}

module.exports = calendarCtrl