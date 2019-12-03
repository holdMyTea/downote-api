import createError from 'http-errors'

import note from '../db/note.db'
import token from './token.controller'

const create = async (body, cookies) => {
  const userId = (await token.verify(cookies))['user_id']

  if (body && body.order && (body.header || body.text)) {
    try {
      return (await note.create(
        body.header,
        body.text,
        body.order,
        userId
      ))['insertId']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  } else {
    throw createError(400, 'Request should contain "order" AND ("header" OR "text")')
  }
}

const update = async (body, cookies, noteId) => {
  const userId = (await token.verify(cookies))['user_id']

  let record
  if (noteId && body && (body.header || body.text)) {
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

    if (record === 0)
      throw createError(400, `Note with id ${noteId} doesn't exist`)

    return noteId
  } else {
    throw createError(400, 'Request should contain "id" AND ("header" OR "text")')
  }
}

const remove = async (body, cookies, noteId) => {
  const userId = (await token.verify(cookies))['user_id']

  let record
  if (noteId) {
    try {
      record = (await note.remove(noteId, userId))['affectedRows']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record === 0)
      throw createError(400, `Note with id ${noteId} doesn't exist`)

    return noteId
  } else {
    throw createError(400, 'Note id is not specified')
  }
}

export default {
  create,
  update,
  remove
}
