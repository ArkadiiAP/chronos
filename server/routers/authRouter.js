const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')
const passport = require('passport')
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth')

router.post('/register', authCtrl.register)
router.post('/activate', authCtrl.activateEmail)
router.post('/login', passport.authenticate('local'), authCtrl.login)
router.post('/resetPassword', authCtrl.forgotPassword)
router.post('/resetPassword/:confirm_token', authCtrl.resetPassword)
router.post('/logout', authCtrl.logout)

module.exports = router