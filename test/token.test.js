import request from 'supertest'
import app from '../src/index'

const isTokenValid = (token) => /[0-9a-zA-Z]{40}/.test(token)

let token

describe('POST /token check', () => {
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
})

describe('POST /token/verify check', () => {
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

  it('Should respond with 400, invalid token format', (done) => {
    request(app)
      .post('/token/verify')
      .send({ token: token.slice(1) })
      .expect(400)
      .expect({ error: 'Invalid token format' }, done)
  })

  it('Should verify the correct token from cookie', (done) => {
    request(app)
      .post('/token/verify')
      .set('Cookie', `token=${token}`)
      .expect(200)
      .expect('Valid token', done)
  })

  it('Should verify the correct, matching token from cookie & body', (done) => {
    request(app)
      .post('/token/verify')
      .set('Cookie', `token=${token}`)
      .send({ token: token })
      .expect(200)
      .expect('Valid token', done)
  })

  it('Should respond with 400, token mismatch', (done) => {
    request(app)
      .post('/token/verify')
      .set('Cookie', `token=${token}`)
      .send({ token: token.toLowerCase() })
      .expect(400)
      .expect({ error: 'Cookie and body tokens mismatch' }, done)
  })
})

describe('POST /token/remove check', () => {
  it('Should remove the correct token', (done) => {
    request(app)
      .post('/token/remove')
      .send({ token })
      .expect(200)
      .expect('Token removed', done)
  })

  it('Should respond with 401, wrong token on the deleted token', (done) => {
    request(app)
      .post('/token/verify')
      .send({ token })
      .expect(401)
      .expect({ error: 'Invalid token' }, done)
  })
})
