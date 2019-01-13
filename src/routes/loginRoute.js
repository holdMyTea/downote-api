import express from 'express'

import controller from '../controller/loginController'

const router = express()

router.post('/', (req, res) => {
  const query = controller.login(req.body)
  if (query.token) {
    res.cookie('token', query.message.token, { maxAge: 48 * 60 * 60 * 1000 })
  }
  res.status(query.code).send(query.message)
})

export default router
