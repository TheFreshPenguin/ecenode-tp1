"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyparser = require("body-parser");
const metrics_1 = require("./metrics");
const app = express();
const port = process.env.PORT || '8080';
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.get('/metrics', (req, res) => {
    metrics_1.MetricsHandler.get((err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/', (req, res) => {
    res.write('Hello world');
    res.end();
});
app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});
