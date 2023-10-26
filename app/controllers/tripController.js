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
          console.log('Job added to queue with ID:', job.id);
        } else {
          console.error('Failed to add job to queue.');
        }
    }).catch(error => {
      console.error('Error adding job to queue:', error)
    })

    return res.status(201).json({ message: 'Trip added successfully'})
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error: error.message })
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
