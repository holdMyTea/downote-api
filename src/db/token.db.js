import db from './index'

/**
 * Saves a token associated with the user.
 * @param {string} token - token to save
 * @param {number} userId - user to associate the token with
 * @returns {Promise}
 */
const save = (token, userId) => db.query(
  `INSERT INTO downote.tokens (id, expires_on, user_id) VALUES(
    '${token}',
    CURRENT_TIMESTAMP + INTERVAL 2 DAY,
    ${userId}
  );`
)

/**
 * Runs a query for token.
 * @param {string} token - token to check
 * @returns {Promise}
 */
const check = token => db.query(
  `DELETE FROM tokens WHERE expires_on < CURRENT_TIMESTAMP;`
)
  .then(
    () => db.query(`SELECT * FROM tokens WHERE id = BINARY "${token}" LIMIT 1;`)
  )
  .then(rows => {
    if (rows[0] && rows[0]['user_id']) {
      return rows[0]['user_id']
    }
    return undefined
  })

/**
 * Removes token from db.
 * @param {string} token
 * @returns {Promise}
 */
const remove = token => db.query(`DELETE FROM downote.tokens WHERE id = '${token}';`)

export default {
  save,
  check,
  remove
}
