import express from 'express'
import asyncHandler from 'express-async-handler'

import controller from '../controllers/notes.controller'

const router = express()

router.post('/', asyncHandler(async (req, res) => {
  console.log(await controller.create(req.body, req.cookies))

  res.status(200).send('Namal')
}))

export default router
