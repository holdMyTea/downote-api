import { fail, internalFail } from './controllerFormatter'
import { token } from '../services/db'

const isTokenValid = (t) => /\w{40}/.test(t)

const resolveToken = (body, cookies) => {
  if (body.token && cookies.token) {
    if (body.token === cookies.token)
      return body.token
    return { error: fail(400, 'Cookie and body tokens mismatch') }
  }
  if (body.token)
    return body.token
  if (cookies.token)
    return cookies.token
  return { error: fail(400, 'Token is missing') }
}

/**
 * Checks tokens from body and cookies of the request.
 * @param body body of the request
 * @param cookies cookies from the request
 * @returns a a valid token or an error object
 */
const validateToken = (body, cookies) => {
  const check = resolveToken(body, cookies)

  if (check.error)
    return check

  if (isTokenValid(check))
    return { token: check }

  return { error: fail(400, 'Invalid token format') }
}

/**
 * Checks tokens from body and cookies of the request
 * and searches it in the database.
 * @param body body of the request
 * @param cookies cookies from the request
 * @returns a record of the user if the token is valid or an error object
 */
const verifyToken = async (body, cookies) => {
  const check = validateToken(body, cookies)

  if (check.error)
    return { error: check.error }

  let record
  try {
    record = await token.check(check.token)
  } catch (error) {
    return { error: internalFail(error) }
  }

  if (!record) // empty set -- no such token
    return { error: fail(401, 'Token doesn\'t exist') }

  return record
}

export {
  validateToken,
  verifyToken
}
