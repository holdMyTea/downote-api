import express from 'express'

import controller from '../controller/loginController'

const router = express()

router.post('/', (req, res) => {
  const query = controller.login(req.body)
  res.status(query.code).send(query.message)
})

export default router
