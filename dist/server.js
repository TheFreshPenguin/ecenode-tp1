"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const metrics_1 = require("./metrics");
const users_1 = require("./users");
const session = require("express-session");
const levelSession = require("level-session-store");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || '8080';
var bodyParser = require('body-parser');
const dbMet = new metrics_1.MetricsHandler('./db/metrics');
const LevelStore = levelSession(session);
const dbUser = new users_1.UserHandler('./db/users');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(morgan('dev'));
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
const authRouter = express.Router();
authRouter.get('/login', (req, res) => {
    res.render('login');
});
authRouter.get('/signup', (req, res) => {
    res.render('signup');
});
authRouter.get('/logout', (req, res) => {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
authRouter.post('/login', (req, res, next) => {
    dbUser.get(req.body.username, (err, result) => {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.username = result.username;
            res.redirect('/');
        }
    });
});
app.use(authRouter);
const userRouter = express.Router();
userRouter.post('/', (req, res, next) => {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            console.log("reqbody type = " + typeof (req.body));
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else {
                    res.status(201).send("user persisted");
                }
            });
        }
    });
});
userRouter.get('/:username', (req, res, next) => {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
app.use('/user', userRouter);
const authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, (req, res, next) => {
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
    res.render('index', { name: req.session.username });
});
app.get('/', (req, res) => {
    res.write('Hello world');
    res.end();
});
app.get('/me', (req, res, next) => {
    dbMet.get(req.session.username, (err, result) => {
        console.log("cookie seesion?= " + req.session.username);
        if (err)
            next(err);
        if (result === undefined) {
            res.write('no result');
            res.send();
        }
        else
            res.json(result);
    });
});
app.get('/:id', (req, res, next) => {
    dbMet.get(req.params.id, (err, result) => {
        if (err)
            next(err);
        if (result === undefined) {
            res.write('no result');
            res.send();
        }
        else
            res.json(result);
    });
});
app.post('/:id', (req, res) => {
    dbMet.save(req.params.id, req.body, (err) => {
        if (err)
            throw (err);
        res.status(200).send();
    });
});
app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});
