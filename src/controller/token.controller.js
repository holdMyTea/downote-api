import { createToken } from '../services/cypher'
import { user, token } from '../services/db'
import { successWithData, successWithMessage, fail, internalFail } from '../helpers/controllerFormatter'
import { validateToken, verifyToken } from '../helpers/tokenValidator'

const isEmailValid = (email) => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)

const create = async ({ email, pass }) => {
  if (isEmailValid(email) && pass) {
    let record
    try {
      record = await user.find(email)
    } catch (error) {
      return internalFail(error)
    }

    if (!record) // empty set -- no user with such email
      return fail(401, 'Wrong login credentials')
    if (record.password !== pass) // user exists, but the pass is wrong
      return fail(401, 'Wrong login credentials')

    const t = createToken()
    token.save(t, record.id)
    return successWithData({ token: t })
  }
  return fail(400, 'Required parameters are missing')
}

const verify = async (body, cookies) => {
  const check = await verifyToken(body, cookies)

  if (check.error)
    return check.error

  return successWithMessage('Valid token')
}

const remove = async (body, cookies) => {
  const check = validateToken(body, cookies)

  if (check.error)
    return check.error

  try {
    await token.remove(check.token)
  } catch (error) {
    return internalFail(error)
  }

  return successWithMessage('Token removed')
}

export default {
  create,
  verify,
  remove
}
