import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'

import tokenRoute from './route/token.route'

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
app.post('/', (request, response) => { throw createError(401, 'Not Auth') })

app.use('/token', tokenRoute)

app.use((err, req, res, next) => {
  console.log('qqq')
  console.error(err)
  res
    .status(err.status || 500)
    .send(err.message || 'Internal server error')
})

app.listen(
  8080,
  () => {
    console.log(`Server started at 8080`)
  }
)

export default app
