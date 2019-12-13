import db from './index'

/**
 * Runs a create note query to the db.
 * @param {string} [header] - note's header, will be set to null if not provided.
 * @param {string} [text] - note's text, will be set to null if not provided.
 * @param {number} order - note's display order
 * @param {number} userId
 * @returns {Promise}
 */
const create = (header, text, order, userId) => db.query(
  `INSERT INTO notes(${header ? 'note_header, ' : ''}${text ? 'note_text, ' : ''}note_order, user_id)
   VALUES(${header ? '\'' + header + '\', ' : ''}${text ? '\'' + text + '\', ' : ''}${order}, ${userId});`
)

/**
 * Runs an update note query to the db.
 * @param {number} id - note's id
 * @param {string} [header] - note's header, will be set to null if not provided.
 * @param {string} [text] - note's text, will be set to null if not provided.
 * @param {number} userId
 * @returns {Promise}
 */
const update = (id, header, text, userId) => db.query(
  `UPDATE notes SET
  note_header = ${header ? '\'' + header + '\'' : null},
  note_text = ${text ? '\'' + text + '\'' : null},
  updated_time = CURRENT_TIMESTAMP
  WHERE id = ${id} AND user_id = ${userId};`
)

/**
 * Runs a delete note query to the db.
 * @param {number} id - note's id
 * @param {number} userId
 * @returns {Promise}
 */
const remove = (id, userId) => db.query(
  `DELETE FROM downote.notes WHERE id = ${id} AND user_id = ${userId} LIMIT 1;`
)

export default {
  create,
  update,
  remove
}
