import express from 'express'
import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

const router = express()

router.post('/', asyncHandler(async (req, res) => {
  if (req.body.pass === '123123') {
    res.json({ token: 'token' })
  } else {
    throw createError(401, 'Get outta here')
  }
}))

export default router
