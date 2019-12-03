import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import { createToken, validateToken } from '../helpers/token.helper'
import user from '../db/user.db'
import token from '../db/token.db'

const isEmailValid = email => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)

const create = asyncHandler(async (req, res) => {
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
})

const verify = asyncHandler(async (req, res) => {
  const t = validateToken(req.cookies, req.body)

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
})

const remove = asyncHandler(async (req, res) => {
  const t = validateToken(req.cookies, req.body)

  try {
    await token.remove(t)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }

  res
    .status(200)
    .clearCookie('token', { path: '/' })
    .json({ message: 'Token removed' })
})

export default {
  create,
  verify,
  remove
}
