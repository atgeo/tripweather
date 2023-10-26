const Queue = require('bull')
const Trip = require('../models/tripModel')

class WeatherQueueService {
  constructor () {
    this.weatherQueue = new Queue('weatherQueue', {
      redis: {
        port: 6379,
        host: '127.0.0.1',
      },
    })
    this.weatherQueue.process('fetchWeatherData', this.fetchWeatherDataHandler)
  }

  async fetchWeatherDataHandler(job) {
    const tripId = job.data.tripId

    const trip = await Trip.findById(tripId);

    trip.processed = true

    await trip.save()

    setTimeout(() => {
      console.log(tripId)
    }, 5000)

    // Fetch weather data and update the trip document
  }
}

module.exports = WeatherQueueService
