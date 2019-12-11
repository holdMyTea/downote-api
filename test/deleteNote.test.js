import request from 'supertest'

import { app, createToken, randomNote, createNote } from './utils'

describe('DELETE /note check', () => {
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

  it('Should delete a note and give 200', (done) => {
    const noteId = notes[0].id

    // removing the note from the saved array for the further assertion
    notes.shift()

    request(app)
      .delete(`/note/${noteId}`)
      .set('Cookie', `token=${token}`)
      .expect(200, {
        noteId,
        message: 'Note has been deleted'
      }, done)
  })

  it('Should verify the above call did delete a note', (done) => {
    request(app)
      .get('/notes')
      .set('Cookie', `token=${token}`)
      .expect(200, notes, done)
  })

  it('Should not update a note w/o token in cookie and give 401', (done) => {
    request(app)
      .delete(`/note/${notes[1].id}`)
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should not delete a note with a wrong token in cookie and give 401', (done) => {
    request(app)
      .delete(`/note/${notes[1].id}`)
      .set('Cookie', `token=TOKENNOTTOKEN`)
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should give 404 when called w/o id in URL', (done) => {
    request(app)
      .delete(`/note`)
      .set('Cookie', `token=${token}`)
      .expect(404, done)
  })

  it('Should give 400 when called with invalid id', (done) => {
    request(app)
      .delete(`/note/notReallyAnIDhere`)
      .set('Cookie', `token=${token}`)
      .expect(400, {
        error: 'Note id is invalid'
      }, done)
  })

  it('Should verify the above error calls didn\'t delete any notes', (done) => {
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
