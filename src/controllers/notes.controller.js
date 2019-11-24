import createError from 'http-errors'

import db from '../services/db'
import token from './token.controller'

const create = async (body, cookies) => {
  const user = (await token.verify(body, cookies)).user_id
  console.log(user)

  if (body && body.order && (body.header || body.text)) {
    try {
      // return the id of the added note here
      db.notes.create(
        body.header,
        body.text,
        body.order,
        user
      )
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  }
}

export default {
  create
}
