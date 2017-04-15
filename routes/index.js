var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {});
});

router.get('/chat', (req, res) => {
  res.render('chat', {});
});

router.get('/status', (req, res, next) => {
  require('../utils/status')(req, res, next);
});

module.exports = router;