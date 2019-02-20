import { createToken } from '../services/cypher'
import { findUser, saveToken, checkToken } from '../services/db'
import { success, fail, internalFail, resolveToken } from '../helpers/controllerFormatter'

const isEmailValid = (email) => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)
const isTokenValid = (token) => /\w{40}/.test(token)

const create = async ({ email, pass }) => {
  if (isEmailValid(email) && pass) {
    let record
    try {
      record = await findUser(email)
    } catch (error) {
      return internalFail(error)
    }

    if (!record) // empty set -- no user with such email
      return fail(401, 'Wrong login credentials')
    if (record.password !== pass) // user exists, but the pass is wrong
      return fail(401, 'Wrong login credentials')

    const token = createToken()
    saveToken(token, record.id)
    return success({ token })
  }
  return fail(400, 'Required parameters are missing')
}

const verify = async (body, cookies) => {
  const token = resolveToken(body, cookies)

  if (!token) // no token provided
    return fail(400, 'Token is missing')

  if (token.bodyToken && token.cookieToken) // token from cookie !== token from body
    return fail(400, 'Cookie and body tokens mismatch')

  if (isTokenValid(token)) {
    let record
    try {
      record = await checkToken(token)
    } catch (error) {
      return internalFail(error)
    }

    if (!record) // empty set -- no such token
      return fail(401, 'Invalid token')

    return success('Valid token')
  }
  return fail(400, 'Invalid token format')
}

export default {
  create,
  verify
}
