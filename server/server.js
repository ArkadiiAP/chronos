const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

const app = express()

require('./config/passport')(passport)

mongoose.connect(process.env.MONGO_URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('avatars'))

app.use('/api/auth', require('./routers/authRouter'))
app.use('/api/users', require('./routers/userRouter'))
app.use('/api/calendars', require('./routers/calendarRouter'))

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running on ${PORT}`))
