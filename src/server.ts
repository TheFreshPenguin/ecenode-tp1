import express = require('express')
import bodyparser = require('body-parser')

import { MetricsHandler } from './metrics'

const app = express()
const port: string = process.env.PORT || '8080'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/metrics', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
