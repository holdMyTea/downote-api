import request from 'supertest'
import app from '../src/index'

const isTokenValid = (token) => /[0-9a-zA-Z]{40}/.test(token)

describe('Login check', () => {
  it('Should respond with 401, wrong logins error', (done) => {
    request(app)
      .post('/login')
      .send({
        email: 'wrong@email.com',
        pass: '123456'
      })
      .expect(401)
      .expect({ error: 'Wrong login credentials' }, done)
  })

  it('Should respond with 400, missing params error', (done) => {
    request(app)
      .post('/login')
      .send({
        email: 'notEvenAnEmail'
      })
      .expect(400)
      .expect({ error: 'Required parameters are missing' }, done)
  })

  it('Should respond with an access token and save it to cookie', (done) => {
    request(app)
      .post('/login')
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
        if (responseToken === cookieToken && isTokenValid(responseToken))
          done()
        else throw new Error('Token mismatch')
      })
  })
})
