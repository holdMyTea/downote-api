import createError from 'http-errors'

import notes from '../db/notes.db'
import token from './token.controller'

const getAll = async (body, cookies) => {
  const userId = (await token.verify(cookies))['user_id']

  try {
    return await notes.getByUser(userId)
  } catch (error) {
    throw createError(500, 'Internal server error')
  }
}

const reorder = async (body, cookies) => {
  const userId = (await token.verify(cookies))['user_id']

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

    let result
    try {
      result = await notes.reorder(body.newOrder, userId)
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (result['affectedRows'] === 0)
      throw createError(400, `No matched rows`)

    return result
  }
}

export default {
  getAll,
  reorder
}
