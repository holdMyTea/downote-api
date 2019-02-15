import request from 'supertest'
import app from '../src/index'

const isTokenValid = (token) => /[0-9a-zA-Z]{40}/.test(token)

describe('Token check', () => {
  it('Should respond with 401, wrong logins', (done) => {
    request(app)
      .post('/token')
      .send({
        email: 'wrong@email.com',
        pass: '123456'
      })
      .expect(401)
      .expect({ error: 'Wrong login credentials' }, done)
  })

  it('Should respond with 400, missing params', (done) => {
    request(app)
      .post('/token')
      .send({
        email: 'notEvenAnEmail'
      })
      .expect(400)
      .expect({ error: 'Required parameters are missing' }, done)
  })

  let token

  it('Should respond with an access token and save it to cookie', (done) => {
    request(app)
      .post('/token')
      .send({
        email: 'kappa@mail.com',
        pass: '123123'
      })
      .expect(200)
      .end((err, res) => {
        if (err)
          throw err

        const responseToken = res.body.token
        const cookieToken = res.headers['set-cookie'][0].slice(6, 46)
        if (responseToken === cookieToken && isTokenValid(responseToken)) {
          token = responseToken
          done()
        } else throw new Error('Token mismatch')
      })
  })

  it('Should verify the correct token', (done) => {
    request(app)
      .post('/token/verify')
      .send({ token })
      .expect(200)
      .expect('Valid token', done)
  })

  it('Should respond with 400, missing token', (done) => {
    request(app)
      .post('/token/verify')
      .expect(400)
      .expect({ error: 'Token is missing' }, done)
  })

  it('Should respond with 401, wrong token', (done) => {
    request(app)
      .post('/token/verify')
      .send({ token: token.toLowerCase() })
      .expect(401)
      .expect({ error: 'Invalid token' }, done)
  })
})
