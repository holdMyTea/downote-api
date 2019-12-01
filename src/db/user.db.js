import db from './index'

const find = email =>
  db.query(`SELECT * FROM users WHERE email = "${email}" LIMIT 1;`)
    .then(rows => rows[0])

export default {
  find
}
