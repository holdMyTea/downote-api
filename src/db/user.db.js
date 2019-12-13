import db from './index'

/**
 * Runs a query by user's email to the db.
 * @param {string} email
 * @returns {Promise}
 */
const find = email =>
  db.query(`SELECT * FROM users WHERE email = "${email}" LIMIT 1;`)
    .then(rows => rows[0])

export default {
  find
}
