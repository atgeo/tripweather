const Queue = require('bull')

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
    // Fetch weather data and update the trip document
  }
}

module.exports = WeatherQueueService
