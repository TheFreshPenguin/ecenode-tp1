const express = require('express')

module.exports = {

  app: app = express()

}


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
        res.send("Hello " + req.params.name);
      }
      else{
        res.send("Hello anonymous");
      }
    });
