import createError from 'http-errors'

import db from '../services/db'
import token from './token.controller'

const create = async (body, cookies) => {
  const user = (await token.verify(body, cookies)).user_id

  if (body && body.order && (body.header || body.text)) {
    try {
      return await db.notes.create(
        body.header,
        body.text,
        body.order,
        user
      )
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  } else {
    throw createError(400, 'Request should contain "order" AND ("header" OR "text")')
  }
}

export default {
  create
}
