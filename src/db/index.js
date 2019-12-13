import mysql from 'mysql'

import env from '../config/environment'

const connection = mysql.createConnection({
  host: env.DB_HOST,
  port: 3306,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE
})

/**
 * Connects to database and calls 'callback' once connected.
 * @param {function} callback
 */
const connectToDatabase = callback => connection.connect(callback)

/**
 * Sends a query to database.
 * @param {string} q - SQL query to be run
 * @returns {Promise} pending promise with the result of query
 */
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
