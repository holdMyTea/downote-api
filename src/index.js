import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import tokenRoute from './routes/token.route'
import notesRoute from './routes/notes.route'

import env from './config/environment'
import db from './services/db'

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  next()
})

app.get('/', (request, response) => response.send('Server here'))
app.use('/token', tokenRoute)
app.use('/notes', notesRoute)

app.use((err, req, res, next) => {
  console.error(err.message)
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal server error' })
})

db.connectToDatabase(() => {
  app.listen(
    env.API_PORT,
    env.API_HOST,
    () => console.log(`Server started at ${env.API_HOST}:${env.API_PORT}`)
  )
  console.log('Database connection established')
})

export default app
