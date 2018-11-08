// ./handles.js
// Necessary imports
const url = require('url')
const qs = require('querystring')

module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url)
    const path = route.pathname
    const params = qs.parse(route.query)

    res.writeHead(200, {'Content-Type': 'text/plain'});

    if (path === '/hello' && 'name' in params) {
      if (params["name"] == "antoine") {
        res.write("Hello, my name is Antoine Castel and I am an ECE student")
      } else {
          res.write('Hello ' + params['name'])
        }
    } else {
      res.write('Hello anonymous')
    }

    res.end();
  }
}
