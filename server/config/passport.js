const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
      await User.findOne({email: email})
        .then(async user => {
          if(!user){
            return done(null, false, {message: 'That email is not registered'})
          }
          await bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err
            if(isMatch) {
              return done(null, user)
            } else {
              return done(null, false, {message: 'Password incorrect'})
            }
          })
        })
    })
  )
  passport.serializeUser(async (user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}