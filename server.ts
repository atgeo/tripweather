import express from 'express'
const app = express()
import mongoose from 'mongoose'
import {config} from 'dotenv'

config()

app.use(express.json())

// @ts-ignore
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: any) => console.error('Error connecting to MongoDB:', err))

import authRoutes from './app/routes/authRoutes'
import userRoutes from './app/routes/userRoutes'
import tripRoutes from './app/routes/tripRoutes'

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/trip', tripRoutes)

const port: number = parseInt(process.env.PORT || '8080')

const host: string = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => console.log('Server Started'))

module.exports = app