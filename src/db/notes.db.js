import db from './index'

/**
 * Runs a select query for all the notes of the user.
 * @param {number} userId
 * @returns {Promise}
 */
const getByUser = userId => db.query(
  `SELECT id, note_header, note_text, note_order, created_time, updated_time
    FROM notes
    WHERE user_id = ${userId};`
)

/**
 * @typedef {Object} NoteForReorder
 * @property {number} id - Id of the note
 * @property {number} order - The new display order of note
 */

/**
 * Runs update query for the arraly of notes provided.
 * @param {NoteForReorder[]} newOrder - notes to update
 * @param {number} userId
 * @returns {Promise}
 */
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
