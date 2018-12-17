import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import { UserHandler, User } from './users'
import session = require('express-session')
import levelSession = require('level-session-store')
import morgan = require('morgan')

const app = express()
const port: string = process.env.PORT || '8080'

var bodyParser = require('body-parser')

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const LevelStore = levelSession(session)

const dbUser: UserHandler = new UserHandler('./db/users')


app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(morgan('dev'))

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.username = result.username
      res.redirect('/')
    }
  })
})

app.use(authRouter)
const userRouter = express.Router()


userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {

        if (err) next(err)

        else {
          res.status(201).send("user persisted")
        }
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

app.use('/user', userRouter)


const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any, next: any) => {

  //get metrics

  // var mets
  //
  // dbMet.get(req.session.username, (err: Error | null, result?: Metric[]) => {
  //   if (err) next(err)
  //   if (result !== undefined) {
  //     mets = result
  //     console.log("found")
  //   }
  // })
  //
  // console.log("mets"+ typeof(mets))


  res.render('index', { name: req.session.username })
})

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})


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
