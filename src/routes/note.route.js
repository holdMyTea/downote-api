import express from 'express'

import controller from '../controllers/note.controller'

const router = express()

router.post('/', controller.addNote)

router
  .put('/:noteId', controller.updateNote)
  .delete('/:noteId', controller.deleteNote)

export default router
