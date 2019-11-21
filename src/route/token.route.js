import express from 'express'
import createError from 'http-errors'

const router = express()

router.post('/', async (req, res) => {
  try {
    if (req.body.pass === '123123') {
      res.json({ token: 'token' })
    } else {
      throw createError(401, 'Get outta here')
    }
  } catch (e) {}
})

export default router
