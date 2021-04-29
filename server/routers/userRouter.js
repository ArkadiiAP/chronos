const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const upload = require('../middleware/upload')
const {ensureAuthenticated} = require('../config/auth')

router.get('/:user_id', ensureAuthenticated, userCtrl.getUserById)
router.get('/', ensureAuthenticated, userCtrl.getAllUsers)
router.post('/avatar', upload.single('avatar'), ensureAuthenticated, userCtrl.changeAvatar)
router.patch('/:user_id', ensureAuthenticated, userCtrl.updateUser)

module.exports = router