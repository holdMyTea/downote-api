import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import notes from '../db/notes.db'
import token from '../db/token.db'

const getAll = asyncHandler(async (req, res) => {
  const userId = await token.check(req.cookies.token)
  if (!userId) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  let records
  try {
    records = await notes.getByUser(userId)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }

  res.status(200).json(records)
})

const reorder = asyncHandler(async (req, res) => {
  const userId = await token.check(req.cookies.token)
  if (!userId) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  const body = req.body

  if (body.newOrder && Array.isArray(body.newOrder)) {
    const idSet = new Set()
    const orderSet = new Set()

    body.newOrder.forEach((i, index) => {
      if (!(i.id && i.order)) {
        res.status(400).json({ error: `Object under ${index} doesn't have required params` })
        return
      }
      idSet.add(i.id)
      orderSet.add(i.order)
    })

    if (orderSet.size < body.newOrder.length) {
      res.status(400).json({ error: `Order values must be unique` })
      return
    }

    if (idSet.size < body.newOrder.length) {
      res.status(400).json({ error: `Id values must be unique` })
      return
    }

    let result
    try {
      result = await notes.reorder(body.newOrder, userId)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (result['affectedRows'] === 0) {
      res.status(400).json({ error: `No matched rows` })
      return
    }

    res.status(200).json({
      affectedRows: result['affectedRows'],
      changedRows: result['changedRows']
    })
  }
})

export default {
  getAll,
  reorder
}
