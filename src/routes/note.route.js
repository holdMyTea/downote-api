import express from 'express'
import asyncHandler from 'express-async-handler'

import controller from '../controllers/note.controller'

const router = express()

router.post('/', asyncHandler(async (req, res) => {
  const noteId = await controller.create(req.body, req.cookies)

  res.status(200).json({ noteId })
}))

router.put('/:id', asyncHandler(async (req, res) => {
  const noteId = await controller.update(req.body, req.cookies, req.params.id)

  res.status(200).json({ noteId })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const noteId = await controller.remove(req.body, req.cookies, req.params.id)

  res.status(200).json({ noteId })
}))

export default router
