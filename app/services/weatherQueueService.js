const Queue = require('bull')
const Trip = require('../models/tripModel')

class WeatherQueueService {
  constructor () {
    this.weatherQueue = new Queue('weatherQueue', {
      redis: {
        host: 'redis',
        port: 6379,
      },
    })

    this.weatherQueue.process('fetchWeatherData', this.fetchWeatherDataHandler)
  }

  async fetchWeatherDataHandler(job) {
    const tripId = job.data.tripId

    const trip = await Trip.findById(tripId)

    // Fetch weather data and update the trip document

    trip.isProcessed = true

    await trip.save()
  }
}

module.exports = WeatherQueueService
