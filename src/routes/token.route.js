import express from 'express'
import asyncHandler from 'express-async-handler'

import controller from '../controllers/token.controller'

const router = express()

router.post('/', asyncHandler(async (req, res) => {
  const token = await controller.create(req.body)
  res
    .status(200)
    .cookie('token', token, {
      maxAge: 48 * 60 * 60 * 1000,
      path: '/'
    })
    .json({ token })
}))

router.post('/verify', asyncHandler(async (req, res) => {
  await controller.verify(req.body, req.cookies)
  res.status(200).json({ message: 'Valid token' })
}))

router.delete('/', asyncHandler(async (req, res) => {
  await controller.remove(req.body, req.cookies)
  res
    .status(200)
    .clearCookie('token', { path: '/' })
    .json({ message: 'Token removed' })
}))

export default router
