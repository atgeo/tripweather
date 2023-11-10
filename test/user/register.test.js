const chai = require('chai')
const supertest = require('supertest')

const { expect } = chai
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
    .expect(201);

    // Add more assertions based on your registration response format
    expect(response.body).to.have.property('message').equal('User registered successfully');
    expect(response.body).to.have.property('user');
    // Add more assertions as needed
  })

  // Add more test cases as needed
})