const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const token = authHeader.substring(7, authHeader.length)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if the user exists in the database, and if needed, store user information in req.user
    const user = await User.findById(decoded.userId).exec()

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = {
  verifyToken,
}
