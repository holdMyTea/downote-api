import request from 'supertest'
import app from '../src/index'

// describe('Server check', () => {
//   it('Responds with 200', (done) => {
//     request(app)
//       .get('/')
//       .expect(200, done)
//   })
// })

describe('Login check', () => {
  it('Should return 401 for wrong logins', (done) => {
    request(app)
      .post('/login')
      .send({
        email: 'wrong@email.com',
        pass: '123456'
      })
      .expect(401)
      .expect({ error: 'Wrong login credentials' }, done)
  })
})
