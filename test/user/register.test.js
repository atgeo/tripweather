const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../index')

const request = supertest(app)

describe('User Registration API', () => {
  it('should register a new user', async () => {
    const response = await request
    .post('/auth/register')
    .send({
      email: 'test@example.com',
      password: 'testpassword',
      firstName: 'First',
      lastName: 'Last',
      dateOfBirth: '2000-01-01'
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)

    expect(response.body).to.have.property('message').equal('User registered successfully')
    expect(response.body).to.have.property('user')
  })

  // Add more test cases as needed
})