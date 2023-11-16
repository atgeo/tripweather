import { Request, Response } from 'express'
const WeatherQueueService = require('../services/weatherQueueService')
import Trip from '../models/tripModel'

const weatherQueueService = new WeatherQueueService()

interface TripRequest extends Request {
  user?: any
}

export const add = async (req: TripRequest, res: Response) => {
  try {
    const user = req.user

    const { city, fromDate, toDate } = req.body

    const newTrip = new Trip({
      city,
      fromDate,
      toDate,
      userId: user._id,
    })

    await newTrip.save()

    weatherQueueService.weatherQueue.add('fetchWeatherData', { tripId: newTrip._id })
      .then((job: { id: any }) => {
        if (job) {
          console.log('Job added to queue with ID:', job.id)
        } else {
          console.error('Failed to add job to queue.')
        }
    }).catch((error: any) => {
      console.error('Error adding job to queue:', error)
    })

    return res.status(201).json({ message: 'Trip added successfully'})
  } catch (error: any) {
    return res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}

export const update = async (req: Request, res: Response) => {
  const tripId = req.params.tripId
  const updatedData = req.body
  const allowedFields = ['city', 'fromDate', 'toDate']
  const filteredData = Object.fromEntries(
    Object.entries(updatedData)
    .filter(([key]) => allowedFields.includes(key))
  )

  try {
    const existingTrip = await Trip.findById(tripId)

    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    const shouldUpdateIsProcessed = existingTrip.city !== updatedData.city ||
      existingTrip.fromDate !== updatedData.fromDate ||
      existingTrip.toDate !== updatedData.toDate

    const updateObject = shouldUpdateIsProcessed
      ? { ...filteredData, isProcessed: false, forecasts: [] }
      : filteredData

    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateObject, { new: true })

    if (updatedTrip && existingTrip.city !== updatedTrip.city) {
      weatherQueueService.weatherQueue.add('fetchWeatherData', { tripId })
        .then((job: { id: any }) => {
          if (job) {
            console.log('Job added to queue with ID:', job.id)
          } else {
            console.error('Failed to add job to queue.')
          }
        }).catch((error: any) => {
          console.error('Error adding job to queue:', error)
        })
    }

    res.json(updatedTrip)
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}

export const viewMyTrips = async (req: TripRequest, res: Response) => {
  try {
    const trips = await Trip.find({ userId: req.user._id })

    res.status(200).json(trips)
  } catch (error: any) {
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}
