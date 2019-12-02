import db from './index'

const getByUser = userId => db.query(
  `SELECT id, note_header, note_text, note_order, created_time, updated_time
    FROM notes
    WHERE user_id = ${userId};`
)

const reorder = (newOrder, userId) => {
  const whenThen = newOrder
    .reduce(
      (acc, cur) => `${acc}WHEN ${cur.id} THEN ${cur.order}
      `, '')

  const ids = newOrder
    .reduce((acc, cur) => `${acc},${cur.id}`, '')
    .slice(1)

  return db.query(
    `UPDATE notes SET note_order =
      CASE id
        ${whenThen}
      END
    WHERE id IN (${ids}) AND user_id = ${userId};`
  )
}

export default {
  getByUser,
  reorder
}
