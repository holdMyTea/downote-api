import moment from 'moment'
import db from './index'

const save = (token, userId) => db.query(
  `INSERT INTO downote.tokens (id, expires_on, user_id) VALUES(
    '${token}',
    '${moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')}',
    ${userId}
  );`
)

const check = token => db.query(
  `DELETE FROM tokens WHERE id = BINARY "${token}" AND expires_on < CURRENT_TIMESTAMP;`
)
  .then(
    () => db.query(`SELECT * FROM tokens WHERE id = BINARY "${token}" LIMIT 1;`)
  )
  .then(rows => rows[0])

const remove = (token) => db.query(`DELETE FROM downote.tokens WHERE id = '${token}';`)

export default {
  save,
  check,
  remove
}
