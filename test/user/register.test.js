const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../index')

const request = supertest(app)

describe('User Registration API', () => {
  it('should register a new user', done => {
    request
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
    .end((err, res) => {
      expect(res.body).to.have.property('message').equal('User registered successfully')
      done()
    })
  })

  /*it('should not register an existing user',  () => {
    request
    .post('/auth/register')
    .send({
      email: 'test@example.com',
      password: 'testpassword',
      firstName: 'First',
      lastName: 'Last',
      dateOfBirth: '2000-01-01'
    })
  })*/
})