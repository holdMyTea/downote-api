import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import { createToken, validateToken } from '../helpers/tokenHelper'
import user from '../db/user.db'
import token from '../db/token.db'

const isEmailValid = email => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)

/**
 * @typedef {Object} CreateTokenBody
 * @property {string} email - User's email
 * @property {string} pass - User's password
 */

/**
 * POST /token controller
 * Creates access token for the user.
 * @param {Object} req - incoming request
 * @param {CreateTokenBody} req.body - body of the incoming request
 */
const create = async (req, res) => {
  const { email, pass } = req.body

  if (isEmailValid(email) && pass) {
    let record
    try {
      record = await user.find(email)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    // empty set -- no user with such email || or pass mismatch
    if (!record || record.password !== pass) {
      res.status(401).json({ error: 'Wrong login credentials' })
      return
    }

    const t = createToken()
    try {
      await token.save(t, record.id) // saving token to db
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    res
      .status(200)
      .cookie('token', t, {
        maxAge: 48 * 60 * 60 * 1000,
        path: '/'
      })
      .json({ token: t })
  } else {
    res.status(400).json({ error: 'Required parameters are missing' })
  }
}

/**
 * @typedef {Object} TokenRequestData
 * @property {string} token - Access token
 */

/**
 * POST /token/verify controller
 * Responds with the current status of the token from body or cookies.
 * @param {Object} req - incoming request
 * @param {TokenRequestData} [req.body] - body of the incoming request
 * @param {TokenRequestData} [req.cookies] - cookies of the incoming request
 */
const verify = async (req, res) => {
  const t = validateToken(req.cookies, req.body)
  if (!t) {
    res.status(400).json({ error: 'Token in missing or invalid' })
    return
  }

  let record
  try {
    record = await token.check(t)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }

  if (!record) { // empty set -- no such token
    res.status(401).json({ error: 'Token doesn\'t exist' })
    return
  }

  res.status(200).json({ message: 'Valid token' })
}

/**
 * DELETE /token controller
 * Deletes the token from body or cookies from db.
 * @param {Object} req - incoming request
 * @param {TokenRequestData} [req.body] - body of the incoming request
 * @param {TokenRequestData} [req.cookies] - cookies of the incoming request
 */
const remove = async (req, res) => {
  const t = validateToken(req.cookies, req.body)

  let result
  try {
    result = await token.remove(t)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }

  if (result['affectedRows'] === 1) {
    res
      .status(200)
      .clearCookie('token', { path: '/' })
      .json({ message: 'Token removed' })
  } else {
    res
      .status(401)
      .clearCookie('token', { path: '/' })
      .json({ message: 'Token doesn\'t exist' })
  }
}

export default {
  create: asyncHandler(create),
  verify: asyncHandler(verify),
  remove: asyncHandler(remove)
}
