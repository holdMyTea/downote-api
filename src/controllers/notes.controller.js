import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import notes from '../db/notes.db'
import findUser from '../helpers/findUser'

/**
 * @typedef {Object} NoteRequestCookie
 * @property {string} token - Access token
 */

/**
 * GET /notes controller
 * Returns the array of all notes present in user's account.
 * @param {Object} req - incoming request
 * @param {NoteRequestCookie} req.cookies - cookies of the incoming request
 */
const getAll = async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  let records
  try {
    records = await notes.getByUser(userId)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }

  const formattedResponse = records.map(n => ({
    id: n.id,
    header: n.note_header === null ? undefined : n.note_header,
    text: n.note_text === null ? undefined : n.note_text,
    order: n.note_order,
    created: n.created_time,
    updated: n.updated_time
  }))

  res.status(200).json(formattedResponse)
}

/**
 * @typedef {Object} NoteForReorder
 * @property {number} id - Id of the note
 * @property {number} order - The new display order of note
 */

/**
 * @typedef {Object} ReorderNotesBody
 * @property {NoteForReorder[]} newOrder - updated order for notes
 */

/**
 * PUT /notes/reorder controller
 * Updates the order of the notes.
 * @param {Object} req - incoming request
 * @param {NoteRequestCookie} req.cookies - cookies of the incoming request
 * @param {ReorderNotesBody} req.body - body of the incoming request
 */
const reorder = async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
    return
  }

  const body = req.body

  if (body.newOrder && Array.isArray(body.newOrder)) {
    const idSet = new Set()
    const orderSet = new Set()

    body.newOrder.forEach((i, index) => {
      if (!(i.id && Number.isInteger(i.order))) {
        res.status(400).json({ error: `Object under ${index} index doesn't have required params` })
        return
      }
      idSet.add(i.id)
      orderSet.add(i.order)
    })

    if (orderSet.size < body.newOrder.length) {
      res.status(400).json({ error: 'Order values must be unique' })
      return
    }

    if (idSet.size < body.newOrder.length) {
      res.status(400).json({ error: 'Id values must be unique' })
      return
    }

    let result
    try {
      result = await notes.reorder(body.newOrder, userId)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (result['affectedRows'] === 0) {
      res.status(400).json({ error: 'No matched rows' })
      return
    }

    res.status(200).json({
      notesMatched: result['affectedRows'],
      notesUpdated: result['changedRows']
    })
  } else {
    res.status(400).json({ error: 'Wrong body, should be { "newOrder": [] }' })
  }
}

export default {
  getAll: asyncHandler(getAll),
  reorder: asyncHandler(reorder)
}
