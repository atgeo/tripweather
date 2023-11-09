const WeatherQueueService = require('../services/weatherQueueService')
const Trip = require('../models/tripModel')

const weatherQueueService = new WeatherQueueService()

exports.add = async (req, res) => {
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
      .then(job => {
        if (job) {
          console.log('Job added to queue with ID:', job.id)
        } else {
          console.error('Failed to add job to queue.')
        }
    }).catch(error => {
      console.error('Error adding job to queue:', error)
    })

    return res.status(201).json({ message: 'Trip added successfully'})
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}

exports.update = async (req, res) => {
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

    if (existingTrip.city !== updatedTrip.city) {
      weatherQueueService.weatherQueue.add('fetchWeatherData', { tripId })
        .then(job => {
          if (job) {
            console.log('Job added to queue with ID:', job.id)
          } else {
            console.error('Failed to add job to queue.')
          }
        }).catch(error => {
          console.error('Error adding job to queue:', error)
        })
    }

    res.json(updatedTrip)
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}

exports.viewMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id })

    res.status(200).json(trips)
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message })
  }
}
