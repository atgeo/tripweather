//const passport = require('passport')
//const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
require('dotenv').config()

exports.register = async (req, res) => {
  try {
    const {email, password, firstName, lastName, dateOfBirth} = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' })
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
    })

    await newUser.save()

    return res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Registration failed' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.status(200).json({ token });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
