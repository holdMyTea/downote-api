import mysql from 'mysql'
import moment from 'moment'

import env from '../config/environment'

const connection = mysql.createConnection({
  host: env.DB_HOST,
  port: 3306,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE
})

const connectToDatabase = (callback) => {
  setTimeout(() => { connection.connect(callback) }, 1000)
}

const query = (query) =>
  new Promise((resolve, reject) =>
    connection.query(query, (error, rows) => {
      if (error)
        return reject(error)
      resolve(rows)
    })
  )

const parseSelect = (rows) =>
  rows[0][0]
    ? JSON.parse(JSON.stringify(rows[0][0]))
    : undefined

const user = {
  find: (email) => query(`CALL find_user('${email}')`)
    .then(rows => parseSelect(rows))
}

const token = {
  save: (token, userId) => query(`CALL insert_token(
    '${token}',
    '${moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')}',
    ${userId}
  );`),
  check: token => query(`CALL check_token('${token}');`).then(rows => parseSelect(rows)),
  remove: token => query(`CALL remove_token('${token}');`)
}

export {
  connectToDatabase,
  user,
  token
}
