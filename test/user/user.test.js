const User = require('../../app/models/userModel')
const { expect } = require('chai')
const { dbConnect, dbDisconnect } = require('../index')

describe('User Model Test Suite', () => {
  before(async () => dbConnect())
  after(async () => dbDisconnect())

  it('should validate saving a new student user successfully', async () => {
    const validUser = new User({
      email: 'test@email.com',
      firstName: 'First',
      lastName: 'Last',
      dateOfBirth: '2000-01-01',
      password: '123456',
    })

    const savedUser = await validUser.save()

    expect(savedUser).to.not.be.null
  })

  it('should validate MongoError duplicate error with code 11000', async () => {
    const validUser = new User({
      email: 'test@email.com',
      firstName: 'First',
      lastName: 'Last',
      dateOfBirth: '2000-01-01',
      password: '123456',
    })

    try {
      await validUser.save()
    } catch (error) {
      const { name, code } = error
      expect(name).to.equal('MongoServerError')
      expect(code).to.equal(11000)
    }
  })
})