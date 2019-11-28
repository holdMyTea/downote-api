import createError from 'http-errors'

import db from '../services/db'
import token from './token.controller'

const getAll = async (body, cookies) => {
  const userId = (await token.verify(body, cookies)).user_id

  try {
    return (await db.notes.get(userId))[0]
  } catch (error) {
    throw createError(500, 'Internal server error')
  }
}

const reorder = async (body, cookies) => {
  await token.verify(body, cookies)

  if (body && body.newOrder && Array.isArray(body.newOrder)) {
    const idSet = new Set()
    const orderSet = new Set()

    body.newOrder.forEach((i, index) => {
      if (!(i.id && i.order)) {
        throw createError(400, `Object under ${index} doesn't have required params`)
      }
      idSet.add(i.id)
      orderSet.add(i.order)
    })

    if (orderSet.size < body.newOrder.length) {
      throw createError(400, `Order values must be unique`)
    }

    if (idSet.size < body.newOrder.length) {
      throw createError(400, `Id values must be unique`)
    }

    try {
      db.notes.reorder(body.newOrder)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  }
}

export default {
  getAll,
  reorder
}
