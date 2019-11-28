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
  find: email => query(`CALL find_user('${email}')`)
    .then(rows => parseSelect(rows))
}

const token = {
  save: (token, userId) => query(
    `CALL insert_token(
      '${token}',
      '${moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')}',
      ${userId}
    );`),

  check: (token) => query(`CALL check_token('${token}');`)
    .then(rows => parseSelect(rows)),

  remove: (token) => query(`CALL remove_token('${token}');`)
}

const note = {
  create: (header, text, order, userId) => query(
    `CALL insert_note(
      '${header || null}',
      '${text || null}',
      ${order},
      ${userId}
    );`
  ).then(rows => parseSelect(rows)['LAST_INSERT_ID()']),

  update: (id, header, text) => query(
    `CALL update_note_content(
      ${id},
      '${header || null}',
      '${text || null}'
    );`
  ),

  delete: id => query(
    `CALL remove_note(${id});`
  )
}

const notes = {
  get: userId => query(
    `CALL get_user_notes(${userId});`
  ),

  reorder: newOrder => {
    const whenThen = newOrder.reduce((acc, cur) =>
      `${acc}WHEN ${cur.id} THEN ${cur.order}
      `, '')

    const ids = newOrder.reduce((acc, cur) =>
      `${acc},${cur.id}`, '').slice(1)

    const a =
      `UPDATE notes SET note_order =
        CASE id
          ${whenThen}
        END
      WHERE id IN (${ids})`

    console.log(a)
    // CLEAN THE MESS
    query(a)
  }
}

export default {
  connectToDatabase,
  user,
  token,
  note,
  notes
}
