import express = require('express')
import { MetricsHandler, Metric } from './metrics'

const app = express()
const port: string = process.env.PORT || '8080'

var bodyParser = require('body-parser')

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

// app.get('/metrics', (req: any, res: any) => {
//   // console.log(MetricsHandler.get)
//   dbMet.get((err: Error | null, result?: any) => {
//     if (err) {
//       throw err
//     }
//     res.json(result)
//   })
// })

app.get('/:id', (req: any, res: any, next: any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
    if (err) next(err)
    if (result === undefined) {
      res.write('no result')
      res.send()
    } else res.json(result)
  })
})

app.post('/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw (err)
    res.status(200).send()
  })
});

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
