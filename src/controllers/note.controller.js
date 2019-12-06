import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import note from '../db/note.db'
import findUser from '../helpers/findUser'

const addNote = asyncHandler(async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const body = req.body
  if (body.order && (body.header || body.text)) {
    let noteId
    try {
      noteId = (await note.create(
        body.header,
        body.text,
        body.order,
        userId
      ))['insertId']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    res.status(200).json({
      noteId,
      message: 'Note has been added'
    })
  } else {
    res.status(400).json({ error: 'Request should contain "order" AND ("header" OR "text")' })
  }
})

const updateNote = asyncHandler(async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const body = req.body
  const noteId = req.params.noteId

  let record
  if (noteId && (body.header || body.text)) {
    try {
      record = (await note.update(
        noteId,
        body.header,
        body.text,
        userId
      ))['affectedRows']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record === 0) {
      res.status(400).json({ error: `Note with id ${noteId} doesn't exist` })
      return
    }

    res.status(200).json({
      noteId,
      message: 'Note has been updated'
    })
  } else {
    res.status(400).json({ error: 'Request should contain "header" OR "text"' })
  }
})

const deleteNote = asyncHandler(async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const noteId = req.params.noteId

  let record
  if (noteId) {
    try {
      record = (await note.remove(noteId, userId))['affectedRows']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record === 0) {
      res.status(400).json({ error: `Note with id ${noteId} doesn't exist` })
      return
    }

    res.status(200).json({
      noteId,
      message: 'Note has been deleted'
    })
  } else {
    res.status(400).json({ error: 'Note id is not specified' })
  }
})

export default {
  addNote,
  updateNote,
  deleteNote
}
