import express from 'express'
import asyncHandler from 'express-async-handler'

import controller from '../controllers/notes.controller'

const router = express()

router.get('/', asyncHandler(async (req, res) => {
  const notes = await controller.getAll(req.body, req.cookies)

  res.status(200).json(notes)
}))

export default router
