import request from 'supertest'

import { app, createToken, createNote, randomNote } from './utils'

describe('POST /notes/reorder check', () => {
  let token // access token to the test account
  let notes // array of the notes that will be created before the suite

  before((done) => {
    // getting token for the account
    createToken('keepo@mail.com', '456456')
      .then(t => (token = t))
      .then(() => Promise.all([ // saving generated notes
        createNote(token, randomNote()),
        createNote(token, randomNote()),
        createNote(token, randomNote())
      ]))
      .then(() => new Promise((resolve, reject) =>
        request(app)
          .get('/notes')
          .set('Cookie', `token=${token}`)
          .end((err, res) => {
            if (err) { reject(err) }
            resolve(res.body)
          })
      ))
      .then(body => {
        notes = body
        done()
      })
  })

  it('Should reorder two notes and give 200', (done) => {
    const body = { newOrder: [] }

    body.newOrder.push({
      id: notes[0].id,
      order: notes[0].order + 1
    })
    notes[0].order = notes[0].order + 1

    body.newOrder.push({
      id: notes[1].id,
      order: notes[1].order + 2
    })
    notes[1].order = notes[1].order + 2

    request(app)
      .put(`/notes/reorder`)
      .set('Cookie', `token=${token}`)
      .send(body)
      .expect(200, {
        notesMatched: 2,
        notesUpdated: 2
      }, done)
  })

  it('Should verify the above reorder', (done) => {
    request(app)
      .get('/notes')
      .set('Cookie', `token=${token}`)
      .expect(200, notes, done)
  })

  it('Should not reorder two notes with the same "order"', (done) => {
    const body = { newOrder: [] }

    body.newOrder.push({
      id: notes[0].id,
      order: 1
    })

    body.newOrder.push({
      id: notes[1].id,
      order: 1
    })

    request(app)
      .put(`/notes/reorder`)
      .set('Cookie', `token=${token}`)
      .send(body)
      .expect(400, {
        error: 'Order values must be unique'
      }, done)
  })

  it('Should not reorder two notes with the same "id"', (done) => {
    const body = { newOrder: [] }

    body.newOrder.push({
      id: notes[0].id,
      order: 1
    })

    body.newOrder.push({
      id: notes[0].id,
      order: 2
    })

    request(app)
      .put(`/notes/reorder`)
      .set('Cookie', `token=${token}`)
      .send(body)
      .expect(400, {
        error: 'Id values must be unique'
      }, done)
  })

  it('Should give 400 on invalid body', (done) => {
    const body = []

    body.push({
      id: notes[0].id,
      order: 1
    })

    body.push({
      id: notes[0].id,
      order: 2
    })

    request(app)
      .put(`/notes/reorder`)
      .set('Cookie', `token=${token}`)
      .send(body)
      .expect(400, {
        error: 'Wrong body, should be { "newOrder": [] }'
      }, done)
  })

  it('Should give 400 when required param is missing in the array', (done) => {
    const body = { newOrder: [] }

    body.newOrder.push({
      id: notes[0].id,
      order: 1
    })

    body.newOrder.push({
      id: notes[1].id
    })

    request(app)
      .put(`/notes/reorder`)
      .set('Cookie', `token=${token}`)
      .send(body)
      .expect(400, {
        error: 'Object under 1 index doesn\'t have required params'
      }, done)
  })

  it('Should not reorder notes w/o token in cookie and give 401', (done) => {
    request(app)
      .put(`/notes/reorder`)
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should not reorder notes with a wrong token in cookie and give 401', (done) => {
    request(app)
      .put(`/notes/reorder`)
      .set('Cookie', `token=TOKENNOTTOKEN`)
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should verify the above error calls didn\'t reorder any notes', (done) => {
    request(app)
      .get('/notes')
      .set('Cookie', `token=${token}`)
      .expect(200, notes, done)
  })

  after(done => {
    Promise.all(
      notes.map(note =>
        new Promise(resolve =>
          request(app)
            .delete(`/note/${note.id}`)
            .set('Cookie', `token=${token}`)
            .expect(200, {
              noteId: note.id,
              message: 'Note has been deleted'
            }, resolve)
        ))
    ).then(() => done())
  })
})
