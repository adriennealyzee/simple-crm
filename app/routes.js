const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get('/allmypeople', function(req, res) {
  console.log('getting all my people');
  console.log('req.user', req.user);
});

module.exports = router;

