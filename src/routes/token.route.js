import express from 'express'

import controller from '../controllers/token.controller'

const router = express()

router
  .post('/', controller.create)
  .delete('/', controller.remove)

router.post('/verify', controller.verify)

export default router
