import request from 'supertest'

import app from '../src/index'

const createToken = (email, pass) =>
  new Promise((resolve, reject) =>
    request(app)
      .post('/token')
      .send({
        email,
        pass
      })
      .expect(200)
      .end((err, res) => {
        if (err) { 
          console.log(err)
          reject(err)
        }

        resolve(res.body.token)
      })
  )

const createNote = (token, note) =>
  new Promise((resolve, reject) =>
    request(app)
      .post('/note')
      .set('Cookie', `token=${token}`)
      .send(note)
      .expect(200)
      .end((err, res) => {
        if (err) { reject(err) }

        resolve(res.body)
      })
)

const isNoteIdValid = noteId => noteId && noteId > 0 && Number.isInteger(noteId)

const isTokenValid = (token) => /[0-9a-zA-Z]{40}/.test(token)

const randomNumber = () => Math.random().toPrecision(8).slice(2)
const randomNote = () => ({
  header: 'randomHeader' + randomNumber(),
  text: 'randomText' + randomNumber(),
  order: 1
})

const compareNotes = (resNote, savedNote) =>
  savedNote.id === resNote.id &&
  savedNote.text === resNote.text &&
  savedNote.header === resNote.header &&
  savedNote.order === resNote.order

export {
  createToken,
  createNote,
  isNoteIdValid,
  isTokenValid,
  randomNumber,
  randomNote,
  compareNotes,
  app
}
