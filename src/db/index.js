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

const notes = {
  get: userId => query(
    `CALL get_user_notes(${userId});`
  ),

  reorder: newOrder => {
    const whenThen = newOrder
      .reduce(
        (acc, cur) => `${acc}WHEN ${cur.id} THEN ${cur.order}
        `, '')

    const ids = newOrder
      .reduce((acc, cur) => `${acc},${cur.id}`, '')
      .slice(1)

    query(
      `UPDATE notes SET note_order =
        CASE id
          ${whenThen}
        END
      WHERE id IN (${ids})`
    )
  }
}

export default {
  connectToDatabase,
  query,
  notes
}
