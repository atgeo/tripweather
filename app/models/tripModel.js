const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isProcessed: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip
