const express = require('express')

module.exports = {

  app: app = express()

}
    app.set('views', __dirname + "/views")
    app.set('view engine', 'ejs');

    path = require('path')
    app.use(express.static(path.join(__dirname, 'public')))

    app.get('/metrics.json', (req, res) => {
      metrics.get((err, data) => {
        if(err) throw err
        res.status(200).json(data)
      })
    });

    app.get('', function(req, res) {
      res.send('hello anonymousse');
    });
    app.get('/hello', function(req, res) {
      res.send('hello anonymousse');
    });

    app.get('/hello/:name', function(req, res) {
      if(req.params.name == "antoine"){
        res.send("Hello, my name is Antoine Castel and I am an ECE student");
      }
      else if (req.params.name.length > 0) {
        res.render('hello.ejs', {name: req.params.name})
      }
      else{
        res.send("Hello anonymous");
      }
    });
