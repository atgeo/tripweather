const Queue = require('bull')
const Redis = require('ioredis')
const Trip = require('../models/tripModel')

class WeatherQueueService {
  constructor () {
    this.redis = new Redis({
      host: 'redis',
      port: 6379,
    })

    this.weatherQueue = new Queue('weatherQueue', { redis: this.redis })

    this.weatherQueue.process('fetchWeatherData', this.fetchWeatherDataHandler)
  }

  async fetchWeatherDataHandler(job) {
    const tripId = job.data.tripId

    const trip = await Trip.findById(tripId)

    trip.processed = true

    await trip.save()

    setTimeout(() => {
      console.log(tripId)
    }, 5000)

    // Fetch weather data and update the trip document
  }
}

module.exports = WeatherQueueService
