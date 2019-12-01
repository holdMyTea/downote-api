import mysql from 'mysql'

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

const query = q =>
  new Promise((resolve, reject) =>
    connection.query(
      q,
      (error, rows) => error ? reject(error) : resolve(rows)
    )
  )

export default {
  connectToDatabase,
  query
}
