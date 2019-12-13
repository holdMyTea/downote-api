import { validateToken } from './tokenHelper'
import token from '../db/token.db'

const sendInvalidTokenResponse = res => res.status(401).json({ error: 'Invalid token' })

/**
 * Finds the userId associated with the request, sends error if not found.
 * @param {Object} req - request object
 * @param {string} req.cookies.token - access token
 * @returns {number} userId
 */
const findUser = async (req, res) => {
  const t = validateToken(req.cookies)
  if (!t) {
    sendInvalidTokenResponse(res)
    return
  }

  let userId
  try {
    userId = await token.check(req.cookies.token)
  } catch (error) {
    console.error(error)
  }

  if (!userId) {
    sendInvalidTokenResponse(res)
    return
  }

  return userId
}

export default findUser
