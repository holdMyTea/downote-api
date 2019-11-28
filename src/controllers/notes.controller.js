import createError from 'http-errors'

import db from '../services/db'
import token from './token.controller'

const getAll = async (body, cookies) => {
  const userId = (await token.verify(body, cookies)).user_id

  return (await db.notes.get(userId))[0]
}

export default {
  getAll
}
