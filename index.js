const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB')
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err)
})

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const tripRoutes = require('./routes/tripRoutes')

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/trip', tripRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => console.log('Server Started'))
