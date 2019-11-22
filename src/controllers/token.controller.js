import createError from 'http-errors'

import { createToken } from '../helpers/tokenGenerator'
import db from '../services/db'

const isEmailValid = email => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)

const create = async ({ email, pass }) => {
  if (isEmailValid(email) && pass) {
    let record
    try {
      record = await db.user.find(email)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (!record) // empty set -- no user with such email
      throw createError(401, 'Wrong login credentials')
    if (record.password !== pass) // user exists, but the pass is wrong
      throw createError(401, 'Wrong login credentials')

    const token = createToken()
    db.token.save(token, record.id) // saving token to db
    return token
  }
  throw createError(400, 'Required parameters are missing')
}

export default {
  create
}
