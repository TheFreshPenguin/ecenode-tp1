const http = require('http')
const handles = require('./handles')
express = require('express')


handles.app.set('port', 8080);

handles.app.listen(
  handles.app.get('port'),
  () => console.log(`server listening on ${app.get('port')}`)
)
