const Queue = require('bull')
const Trip = require('../models/tripModel')
const weather = require('weather-js')

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

    weather.find({search: trip.city, degreeType: 'C'}, function (err, result) {
      if (err) console.log(err)

      const forecast = result[0]['forecast']

      const currentDate = new Date(trip.fromDate)

      const forecastsToAdd = []

      while (currentDate <= trip.toDate) {
        const date = currentDate.toISOString().slice(0, 10)
        const forecastData = forecast.find(item => item.date === date)

        forecastsToAdd.push(
          {
            date,
            condition: forecastData.skytextday,
            temperature: forecastData.high,
          },
        )

        currentDate.setDate(currentDate.getDate() + 1)
      }

      trip.forecasts = trip.forecasts.concat(forecastsToAdd)
      trip.isProcessed = true

      trip.save()
    })
  }
}

module.exports = WeatherQueueService
