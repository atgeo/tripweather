import mongoose, { Document, model, Schema } from 'mongoose'

interface Forecast extends Document {
  date: Date
  condition: string
  temperature: number
}

const forecastSchema = new Schema<Forecast>({
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

interface Trip extends Document {
  city: string
  fromDate: Date
  toDate: Date,
  userId: Schema.Types.ObjectId
  isProcessed: boolean
  forecasts: [Forecast]
}

const tripSchema = new Schema<Trip>({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isProcessed: {
    type: Boolean,
    default: false,
  },
  forecasts: [forecastSchema],
}, {
  timestamps: true,
})

const TripModel = model<Trip>('Trip', tripSchema)

module.exports = TripModel
