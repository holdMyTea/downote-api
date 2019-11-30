import createError from 'http-errors'

import note from '../db/note'
import token from './token.controller'

const create = async (body, cookies) => {
  const userId = (await token.verify(body, cookies))['user_id']

  if (body && body.order && (body.header || body.text)) {
    try {
      return (await note.create(
        body.header,
        body.text,
        body.order,
        userId
      ))['insertId']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }
  } else {
    throw createError(400, 'Request should contain "order" AND ("header" OR "text")')
  }
}

const update = async (body, cookies) => {
  await token.verify(body, cookies)

  let record
  if (body && body.id && (body.header || body.text)) {
    try {
      record = (await note.update(
        body.id,
        body.header,
        body.text
      ))['affectedRows']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record === 0)
      throw createError(400, `Note with id ${body.id} doesn't exist`)

    return body.id
  } else {
    throw createError(400, 'Request should contain "id" AND ("header" OR "text")')
  }
}

const remove = async (body, cookies) => {
  await token.verify(body, cookies)

  let record
  if (body && body.id) {
    try {
      record = (await note.remove(body.id))['affectedRows']
    } catch (error) {
      throw createError(500, 'Internal server error')
    }

    if (record === 0)
      throw createError(400, `Note with id ${body.id} doesn't exist`)

    return body.id
  } else {
    throw createError(400, '"id" property is missing')
  }
}

export default {
  create,
  update,
  remove
}
