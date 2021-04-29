const router = require('express').Router()
const {ensureAuthenticated} = require('../config/auth')
const calendarCtrl = require('../controllers/calendarCtrl')

router.get('/', ensureAuthenticated, calendarCtrl.getAllCalendars)
router.post('/', ensureAuthenticated, calendarCtrl.createCalendar)
router.delete('/:calendar_id', ensureAuthenticated, calendarCtrl.deleteCalendar)
router.patch('/:calendar_id', ensureAuthenticated, calendarCtrl.updateCalendar)
router.post('/:calendar_id/share', ensureAuthenticated, calendarCtrl.shareCalendar)
router.post('/:calendar_id/unshare', ensureAuthenticated, calendarCtrl.unShareCalendar)

module.exports = router