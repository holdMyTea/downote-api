import db from './index'

const save = (token, userId) => db.query(
  `INSERT INTO downote.tokens (id, expires_on, user_id) VALUES(
    '${token}',
    CURRENT_TIMESTAMP + INTERVAL 2 DAY,
    ${userId}
  );`
)

const check = token => db.query(
  `DELETE FROM tokens WHERE id = BINARY "${token}" AND expires_on < CURRENT_TIMESTAMP;`
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

const remove = (token) => db.query(`DELETE FROM downote.tokens WHERE id = '${token}';`)

export default {
  save,
  check,
  remove
}
