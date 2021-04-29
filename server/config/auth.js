module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    return res.status(401).json({msg: "Please login"})
  },
  forwardAuthenticated: function (req, res, next) {
    if(!req.isAuthenticated()) {
      return next()
    }
    return res.status(400).json({msg: "You already logged in"})
  }
}