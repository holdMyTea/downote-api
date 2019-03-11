import express from 'express'

import controller from '../controller/token.controller'

const router = express()

router.post('/', async (req, res) => {
  const query = await controller.create(req.body)

  if (query.message.token)
    res.cookie('token', query.message.token, {
      maxAge: 48 * 60 * 60 * 1000,
      path: '/'
    })

  res.status(query.code).send(query.message)
})

router.post('/verify', async (req, res) => {
  const query = await controller.verify(req.body, req.cookies)
  res.status(query.code).send(query.message)
})

router.delete('/', async (req, res) => {
  const query = await controller.remove(req.body, req.cookies)

  if (query.code === 200)
    res.clearCookie('token', { path: '/' })

  res.status(query.code).send(query.message)
})

export default router
