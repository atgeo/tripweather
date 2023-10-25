const User = require('../models/userModel')

exports.getUserProfile = (req, res) => {
  const user = req.user // User information from the middleware

  res.status(200).json(user)
}
