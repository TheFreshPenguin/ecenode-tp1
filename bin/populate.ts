#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import { UserHandler, User } from '../src/users'


//some metrics 

const met = [
  new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`, 12),
  new Metric(`${new Date('2013-11-04 14:15 UTC').getTime()}`, 10),
  new Metric(`${new Date('2013-11-04 14:30 UTC').getTime()}`, 8)
]

const db = new MetricsHandler('../db/metrics')

db.save('thomyorke', met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})



//use the userRouter

const dbUser: UserHandler = new UserHandler('../db/users')


var u = {"username":"thomyorke", "email":"ok@computer.com", "password":"karmapolice"}
dbUser.get(u["username"], function (err: Error | null, result?: User) {
  if (!err || result !== undefined) {
    console.log("user already exists")
  } else {
    var user = new User(u["username"], u["email"], u["password"])
    dbUser.save(user, function (err: Error | null) {

      if (err) throw(err)

      else {
        console.log("user persisted")
      }
    })
  }
})
