import db from './index'

const create = (header, text, order, userId) => db.query(
  `INSERT INTO notes(note_header, note_text, note_order, user_id)
    VALUES (
      '${header || null}',
      '${text || null}',
      ${order},
      ${userId}
  );`
)

const update = (id, header, text, userId) => db.query(
  `UPDATE notes SET
  note_header = '${header || null}',
  note_text = '${text || null}',
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
