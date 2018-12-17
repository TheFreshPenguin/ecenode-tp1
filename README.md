# ecenode-tp1

## introduction

final project

## installation instructions

please run `npm-run start`
## usage instructions

Go to http://localhost:8080
Here, you can create a new user by going to create an user.
Then, after filling the form, go back to the index.

populate some metrics using postman:

post request to http://localhost:8080/:username

`[
  { "timestamp":"1384686660003", "value":"16" },
  { "timestamp":"1384686660004", "value":"16" },
  { "timestamp":"1384686660005", "value":"16" },
  { "timestamp":"1384686660006", "value":"16" }
]`

if you log in, you will be able to see your own metrics.

In this version you can't access other metrics but the route function that calls only the metrics of the logged in person is independant (GET - http://localhost:8080/me ) from the omniscient route function (all metrics available)

## contributors

only me and coffee
