import db from './index'

const create = (header, text, order, userId) => {
  const line1 = `INSERT INTO notes(${header ? 'note_header, ' : ''}${text ? 'note_text, ' : ''}note_order, user_id)`
  const line2 = ` VALUES(${header ? '\'' + header + '\', ' : ''}${text ? '\'' + text + '\', ' : ''}${order}, ${userId});`

  return db.query(
    line1 + line2
  )
}

const update = (id, header, text, userId) => db.query(
  `UPDATE notes SET
  note_header = ${header ? '\'' + header + '\'' : null},
  note_text = ${text ? '\'' + text + '\'' : null},
  updated_time = CURRENT_TIMESTAMP
  WHERE id = ${id} AND user_id = ${userId};`
)

const remove = (id, userId) => db.query(
  `DELETE FROM downote.notes WHERE id = ${id} AND user_id = ${userId} LIMIT 1;`
)

export default {
  create,
  update,
  remove
}
