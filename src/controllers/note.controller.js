import createError from 'http-errors'

import db from '../db'
import token from './token.controller'

const create = async (body, cookies) => {
  const userId = await token.verify(body, cookies)

  if (body && body.order && (body.header || body.text)) {
    try {
      return await db.note.create(
        body.header,
        body.text,
        body.order,
        userId
      )
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  } else {
    throw createError(400, 'Request should contain "order" AND ("header" OR "text")')
  }
}

const update = async (body, cookies) => {
  await token.verify(body, cookies)

  if (body && body.id && (body.header || body.text)) {
    try {
      await db.note.update(
        body.id,
        body.header,
        body.text
      )

      return body.id
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  }
}

const remove = async (body, cookies) => {
  await token.verify(body, cookies)

  if (body && body.id) {
    try {
      await db.note.delete(
        body.id
      )

      return body.id
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  }
}

export default {
  create,
  update,
  remove
}
