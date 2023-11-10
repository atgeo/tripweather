process.env.NODE_ENV = 'test'
process.env.MONGODB_URI = 'mongodb://mongodb/tripweather-test'
process.env.PORT = '8081'

const app = require('../server')

module.exports = app