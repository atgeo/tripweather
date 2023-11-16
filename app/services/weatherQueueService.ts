import Bull, {Queue, Job} from 'bull'
import TripModel from '../models/tripModel'
import weather from 'weather-js'

export default class WeatherQueueService {
  public weatherQueue: Queue

  constructor () {
    this.weatherQueue = new Bull('weatherQueue', {
      redis: {
        host: 'redis',
        port: 6379,
      },
    })

    this.weatherQueue.process('fetchWeatherData', this.fetchWeatherDataHandler)
  }

  async fetchWeatherDataHandler(job: Job) {
    const tripId = job.data.tripId

    const trip = await TripModel.findById(tripId)

    if (!trip) {
      console.error(`Trip with id ${tripId} not found`)
      return
    }

    //todo fix result type of weather-js
    weather.find({search: trip.city, degreeType: 'C'}, function (err: Error, result: any) {
      if (err) console.log(err)

      const forecast = result[0]['forecast']

      const currentDate = new Date(trip.fromDate)

      const forecastsToAdd = []

      while (currentDate <= trip.toDate) {
        const date = currentDate.toISOString().slice(0, 10)
        const forecastData = forecast.find((item: any) => item.date === date)

        forecastsToAdd.push(
          {
            date,
            condition: forecastData.skytextday,
            temperature: forecastData.high,
          },
        )

        currentDate.setDate(currentDate.getDate() + 1)
      }

      // @ts-ignore
      trip.forecasts = forecastsToAdd
      trip.isProcessed = true

      trip.save()
    })
  }
}