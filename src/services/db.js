import mysql from 'mysql'

import env from '../config/environment'

const connection = mysql.createConnection({
  host: env.DB_HOST,
  port: 3306,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  insecureAuth: true
})

const connect = (callback) => {
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

const findUser = (email) => query(`CALL search_user('${email}')`)
  .then(rows => rows[0][0])

export default {
  connect,
  findUser
}
