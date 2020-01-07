import request from 'supertest'

import { app, randomNumber, compareNotes, beforeForNotes, afterForNotes } from './utils'

describe('PUT /note check', () => {
  let token // access token to the test account
  let initialNotes // array of the notes that will be created before the suite
  const updatedNotes = [] // array of the notes that will be updated in tests

  let firstBodyCheck // intermediate variable for /notes body

  beforeAll(() => beforeForNotes().then(res => {
    token = res.token
    initialNotes = res.notes
  }))

  it('Should update a note and give 200', (done) => {
    // this is how the note should look like after the update
    const note = {
      id: initialNotes[0].id,
      order: initialNotes[0].order,
      header: 'newHeader' + randomNumber(),
      text: 'newText' + randomNumber()
    }
    updatedNotes.push(note)

    request(app)
      .put(`/note/${note.id}`)
      .set('Cookie', `token=${token}`)
      .send({
        header: note.header,
        text: note.text
      })
      .expect(200, {
        noteId: note.id,
        message: 'Note has been updated'
      }, done)
  })

  it('Should update a note w/o header and give 200', (done) => {
    const note = {
      id: initialNotes[1].id,
      order: initialNotes[1].order,
      header: undefined,
      text: 'newText' + randomNumber()
    }
    updatedNotes.push(note)

    request(app)
      .put(`/note/${note.id}`)
      .set('Cookie', `token=${token}`)
      .send({ text: note.text })
      .expect(200, {
        noteId: note.id,
        message: 'Note has been updated'
      }, done)
  })

  it('Should update a note w/o text and give 200', (done) => {
    const note = {
      id: initialNotes[2].id,
      order: initialNotes[2].order,
      header: 'newHeader' + randomNumber(),
      text: undefined
    }
    updatedNotes.push(note)

    request(app)
      .put(`/note/${note.id}`)
      .set('Cookie', `token=${token}`)
      .send({ header: note.header })
      .expect(200, {
        noteId: note.id,
        message: 'Note has been updated'
      }, done)
  })

  it('Should verify the above updated notes are indeed updated', (done) => {
    request(app)
      .get('/notes')
      .set('Cookie', `token=${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) { throw err }

        // saving current body for a later assertion
        firstBodyCheck = res.body

        // checking that all updated notes are present
        updatedNotes.forEach(note => {
          if (!res.body.find(el => compareNotes(el, note))) {
            throw new Error('The note has not been updated: ' + JSON.stringify(note))
          }
        })

        // checking that initial notes are no longer present
        initialNotes.forEach(note => {
          if (res.body.find(el => compareNotes(el, note))) {
            throw new Error('The initial note is still present: ' + JSON.stringify(note))
          }
        })
        done()
      })
  })

  it('Should not update a note w/o text or header and give 400', (done) => {
    request(app)
      .put(`/note/${updatedNotes[0].id}`)
      .set('Cookie', `token=${token}`)
      .send({})
      .expect(400, {
        error: 'Request should contain "header" OR "text"'
      }, done)
  })

  it('Should not update a note w/o token in cookie and give 401', (done) => {
    request(app)
      .put(`/note/${updatedNotes[1].id}`)
      .send({
        header: 'newHeader' + randomNumber(),
        text: 'newText' + randomNumber()
      })
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should not update a note with a wrong token in cookie and give 401', (done) => {
    request(app)
      .put(`/note/${updatedNotes[2].id}`)
      .set('Cookie', `token=TOKENNOTTOKEN`)
      .send({
        header: 'newHeader' + randomNumber(),
        text: 'newText' + randomNumber()
      })
      .expect(401, {
        error: 'Invalid token'
      }, done)
  })

  it('Should give 404 when called w/o id in URL', (done) => {
    request(app)
      .put(`/note`)
      .set('Cookie', `token=${token}`)
      .send({
        header: 'newHeader' + randomNumber(),
        text: 'newText' + randomNumber()
      })
      .expect(404, done)
  })

  it('Should give 400 when called with invalid id', (done) => {
    request(app)
      .put(`/note/notReallyAnIDhere`)
      .set('Cookie', `token=${token}`)
      .send({
        header: 'newHeader' + randomNumber(),
        text: 'newText' + randomNumber()
      })
      .expect(400, {
        error: 'Note id is invalid'
      }, done)
  })

  it('Should verify the above error calls didn\'t update any notes', (done) => {
    request(app)
      .get('/notes')
      .set('Cookie', `token=${token}`)
      .expect(200, firstBodyCheck, done)
  })

  afterAll(() => afterForNotes(token, initialNotes))
})
