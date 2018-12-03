"use strict";
var http = require('http');
var handles = require('./handles');
express = require('express');
handles.app.set('port', 8080);
handles.app.listen(handles.app.get('port'), function () { return console.log("server listening on " + app.get('port')); });
