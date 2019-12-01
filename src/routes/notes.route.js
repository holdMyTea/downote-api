import express from 'express'
import asyncHandler from 'express-async-handler'

import controller from '../controllers/notes.controller'

const router = express()

router.get('/', asyncHandler(async (req, res) => {
  const notes = await controller.getAll(req.body, req.cookies)

  res.status(200).json(notes)
}))

router.put('/reorder', asyncHandler(async (req, res) => {
  const result = await controller.reorder(req.body, req.cookies)

  res.status(200).json({
    affectedRows: result['affectedRows'],
    changedRows: result['changedRows']
  })
}))

export default router
