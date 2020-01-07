import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import note from '../db/note.db'
import findUser from '../helpers/findUser'

/**
 * @typedef {Object} NoteRequestCookie
 * @property {string} token - Access token
 */

/**
 * @typedef {Object} AddNoteBody
 * @property {string} [header] - header of the new note
 * @property {string} [text] - text of the new note
 * @property {number} order - display order of the new note
 */

/**
 * POST /note controller
 * Saves incoming note to the database and returns new 'noteId' or error message.
 * @param {Object} req - incoming request
 * @param {NoteRequestCookie} req.cookies - cookies of the incoming request
 * @param {AddNoteBody} req.body - body of the incoming request
 */
const addNote = async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const body = req.body
  if (Number.isInteger(body.order) && (body.header || body.text)) {
    let record
    try {
      record = await note.create(
        body.header,
        body.text,
        body.order,
        userId
      )
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    res.status(200).json({
      noteId: Number(record['insertId']),
      message: 'Note has been added'
    })
  } else {
    res.status(400).json({ error: 'Request should contain "order" AND ("header" OR "text")' })
  }
}

/**
 * @typedef {Object} NoteRequestParams
 * @property {number} noteId - Id of the note
 */

/**
 * @typedef {Object} UpdateNoteBody
 * @property {string} [header] - header of the new note
 * @property {string} [text] - text of the new note
 */

/**
 * PUT /note controller
 * Updates note's headers and text, sets them to null if either is not provided.
 * @param {Object} req - incoming request
 * @param {NoteRequestParams} req.params - URL params of the incoming request
 * @param {NoteRequestCookie} req.cookies - cookies of the incoming request
 * @param {UpdateNoteBody} req.body - body of the incoming request
 */
const updateNote = async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const body = req.body
  const noteId = Number(req.params.noteId)

  if (!Number.isInteger(noteId)) {
    res.status(400).json({ error: 'Note id is invalid' })
    return
  }

  let record
  if (noteId && (body.header || body.text)) {
    try {
      record = await note.update(
        noteId,
        body.header,
        body.text,
        userId
      )
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record === 0) {
      res.status(400).json({ error: `Note with id ${noteId} doesn't exist` })
      return
    }

    res.status(200).json({
      noteId: Number(noteId),
      message: 'Note has been updated'
    })
  } else {
    res.status(400).json({ error: 'Request should contain "header" OR "text"' })
  }
}

/**
 * DELETE /note controller
 * Deletes note from the database.
 * @param {Object} req - incoming request
 * @param {NoteRequestParams} req.params - URL params of the incoming request
 * @param {NoteRequestCookie} req.cookies - cookies of the incoming request
 */
const deleteNote = async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const noteId = Number(req.params.noteId)

  if (!Number.isInteger(noteId)) {
    res.status(400).json({ error: 'Note id is invalid' })
    return
  }

  let record
  if (noteId) {
    try {
      record = await note.remove(noteId, userId)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record['affectedRows'] === 0) {
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
}

export default {
  addNote: asyncHandler(addNote),
  updateNote: asyncHandler(updateNote),
  deleteNote: asyncHandler(deleteNote)
}
