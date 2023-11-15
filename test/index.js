process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod

const dbConnect = async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(uri, mongooseOpts)
};

const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

module.exports = {dbConnect, dbDisconnect}