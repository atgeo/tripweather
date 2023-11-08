const mongoose = require('mongoose')

const forecastSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
})

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
  forecasts: [forecastSchema]
}, {
  timestamps: true,
})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip
