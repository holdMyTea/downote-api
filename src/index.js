import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'

import env from './config/environment'
import loginRoute from './routes/loginRoute'
import db from './services/db'

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.get('/', (request, response) => response.send('Server here'))
app.use('/login', loginRoute)

db.connect(() => {
  app.listen(
    env.API_PORT,
    env.API_HOST,
    () => console.log(`Server started at ${env.API_HOST}:${env.API_PORT}`)
  )
  console.log('Database connection established')
})

export default app
