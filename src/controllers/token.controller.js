import createError from 'http-errors'

import { createToken, validateToken } from '../helpers/token.helper'
import user from '../db/user'
import token from '../db/token'

const isEmailValid = email => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)

const create = async ({ email, pass }) => {
  if (isEmailValid(email) && pass) {
    let record
    try {
      record = await user.find(email)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (!record) // empty set -- no user with such email
      throw createError(401, 'Wrong login credentials')
    if (record.password !== pass) // user exists, but the pass is wrong
      throw createError(401, 'Wrong login credentials')

    const t = createToken()
    try {
      await token.save(t, record.id) // saving token to db
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    return t
  }
  throw createError(400, 'Required parameters are missing')
}

const verify = async (body, cookies) => {
  const t = validateToken(body, cookies)

  let record
  try {
    record = await token.check(t)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }

  if (!record) // empty set -- no such token
    throw createError(401, 'Token doesn\'t exist')

  return record
}

const remove = async (body, cookies) => {
  const t = validateToken(body, cookies)

  try {
    await token.remove(t)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }
}

export default {
  create,
  verify,
  remove
}
