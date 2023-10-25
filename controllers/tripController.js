const Trip = require('../models/tripModel')

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

    // add job

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
