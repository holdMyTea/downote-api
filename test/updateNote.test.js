import request from 'supertest'

import { app, createToken, createNote, randomNumber, randomNote } from './utils'

describe('PUT /note check', () => {
  let token
  let initialNotes = []
  let updatedNotes = []

  before((done) => {
    initialNotes.push(randomNote())
    initialNotes.push(randomNote())
    initialNotes.push(randomNote())

    createToken('kippa@mail.com', '789789')
      .then(t => (token = t))
      .then(() => Promise.all([
        createNote(token, initialNotes[0]).then(res => (initialNotes[0].id = res.noteId)),
        createNote(token, initialNotes[1]).then(res => (initialNotes[1].id = res.noteId)),
        createNote(token, initialNotes[2]).then(res => (initialNotes[2].id = res.noteId))
      ]))
      .then(() => done())
  })

  it('Should update a note and give 200', (done) => {
    const note = {
      id: initialNotes[0].id,
      order: initialNotes[0].order,
      header: 'newHeader' + randomNumber(),
      text: 'newText' + randomNumber()
    }

    request(app)
      .put(`/note/${note.id}`)
      .set('Cookie', `token=${token}`)
      .send({
        header: note.header,
        text: note.text
      })
      .expect(200)
      .end((err, res) => {
        if (err) { throw err }

        const {noteId, message} = res.body

        if (message && message === 'Note has been updated') {
          if (noteId === note.id) {
            updatedNotes.push(note)
            done()
          } else {
            throw new Error('"noteId" is invalid')
          }
        } else {
          throw new Error('Message is invalid')
        }
      })
  })
})
