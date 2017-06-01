'use strict';

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');

const http = require('http');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(cookieParser('WANTEDSECRET'));
app.use(session({
  name: 'express_test',
  secret: 'express.test',
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    db: 15,
    prefix: 'express.test:',
    ttl: 20, // seconds
  }),
  cookie: {
    path: '/',
    secure: 'auto',
    // maxAge: 20000, // millseconds
  }
}));

app.route('/')
  .get(function(req, res) {
    const begginer = req.session.value || Math.random();
    req.session.value = begginer;
    res.send('Beginner value: ' + begginer);

    console.log(req.cookies);
  });

server.listen(port);
