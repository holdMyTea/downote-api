import express from 'express'
import asyncHandler from 'express-async-handler'

import controller from '../controllers/token.controller'

const router = express()

router.post('/', asyncHandler(async (req, res) => {
  const token = await controller.create(req.body)

  res.cookie('token', token, {
    maxAge: 48 * 60 * 60 * 1000,
    path: '/'
  })

  res.status(200).send({ token })
}))

export default router
