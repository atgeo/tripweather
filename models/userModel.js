const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    set: date => new Date(`${date}Z`),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
})

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS))

    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.methods.comparePassword = candidatePassword => bcrypt.compare(candidatePassword, this.password)

const User = mongoose.model('User', userSchema)

module.exports = User
