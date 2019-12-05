import createError from 'http-errors'
import asyncHandler from 'express-async-handler'

import notes from '../db/notes.db'
import findUser from '../helpers/findUser'

const getAll = asyncHandler(async (req, res) => {
  const userId = await findUser(req, res)
  if (!userId) {
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
  const userId = await findUser(req, res)
  if (!userId) {
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
