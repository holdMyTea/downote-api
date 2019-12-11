import request from 'supertest'

import { app, createToken, isNoteIdValid, randomNumber, compareNotes, afterForNotes } from './utils'

describe('POST /note check', () => {
  let token
  const createdNotes = []

  before(() => createToken('keepo@mail.com', '456456')
    .then(t => (token = t)))

  it('Should create a note and give 200', (done) => {
    const note = {
      header: 'header' + randomNumber(),
      text: 'text' + randomNumber(),
      order: 1
    }

    request(app)
      .post('/note')
      .set('Cookie', `token=${token}`)
      .send(note)
      .expect(200)
      .end((err, res) => {
        if (err) { throw err }

        const { noteId, message } = res.body

        if (message && message === 'Note has been added') {
          if (isNoteIdValid(noteId)) {
            note.id = noteId
            createdNotes.push(note)
            done()
          } else {
            throw new Error('"noteId" is invalid')
          }
        } else {
          throw new Error('Message is invalid')
        }
      })
  })

  it('Should create a note w/o header and give 200', (done) => {
    const note = {
      text: 'text' + randomNumber(),
      order: 2
    }

    request(app)
      .post('/note')
      .set('Cookie', `token=${token}`)
      .send(note)
      .expect(200)
      .end((err, res) => {
        if (err) { throw err }

        const { noteId, message } = res.body

        if (message && message === 'Note has been added') {
          if (isNoteIdValid(noteId)) {
            note.id = noteId
            createdNotes.push(note)
            done()
          } else {
            throw new Error('"noteId" is invalid')
          }
        } else {
          throw new Error('Message is invalid')
        }
      })
  })

  it('Should create a note w/o text and give 200', (done) => {
    const note = {
      header: 'header' + randomNumber(),
      order: 3
    }

    request(app)
      .post('/note')
      .set('Cookie', `token=${token}`)
      .send(note)
      .expect(200)
      .end((err, res) => {
        if (err) { throw err }

        const { noteId, message } = res.body

        if (message && message === 'Note has been added') {
          if (isNoteIdValid(noteId)) {
            note.id = noteId
            createdNotes.push(note)
            done()
          } else {
            throw new Error('"noteId" is invalid')
          }
        } else {
          throw new Error('Message is invalid')
        }
      })
  })

  it('Should verify the above created notes are indeed created', (done) => {
    request(app)
      .get('/notes')
      .set('Cookie', `token=${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) { throw err }

        createdNotes.forEach(note => {
          if (!res.body.find(el => compareNotes(el, note))) {
            throw new Error('The note has not been added: ' + JSON.stringify(note))
          }
        })
        done()
      })
  })

  it('Should not create a note w/o "order" and give 400', (done) => {
    request(app)
      .post('/note')
      .set('Cookie', `token=${token}`)
      .send({
        header: 'Test header',
        text: 'Test text'
      })
      .expect(400, {
        error: 'Request should contain "order" AND ("header" OR "text")'
      }, done)
  })

  it('Should not create a note w/o "header" or "text" and give 400', (done) => {
    request(app)
      .post('/note')
      .set('Cookie', `token=${token}`)
      .send({
        order: 1
      })
      .expect(400, {
        error: 'Request should contain "order" AND ("header" OR "text")'
      }, done)
  })

  it('Should not create a note w/o token in cookie and give 401', (done) => {
    request(app)
      .post('/note')
      .send({
        header: 'Test header',
        text: 'Test text',
        order: 1
      })
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should not create a note with a wrong token in cookie and give 401', (done) => {
    request(app)
      .post('/note')
      .set('Cookie', `token=NOTREALLYATOKENHERE`)
      .send({
        header: 'Test header',
        text: 'Test text',
        order: 1
      })
      .expect(401,
        { error: 'Invalid token'
        }, done)
  })

  after(() => afterForNotes(token, createdNotes))
})
