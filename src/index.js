import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import loginRoute from './routes/loginRoute'

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

app.get('/', (request, response) => response.send('Server here'))
app.use('/login', loginRoute)

app.listen(8082, 'localhost', () => console.log('Server started'))

export default app
