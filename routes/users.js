var express = require('express');
var router = express.Router();
var passport = require('passport')
const User = require('../models/user');
const checkAuth = require('../checkAuth/checkAuth');



router.get('/dashboard',checkAuth,function(req, res, next) {
    res.render('dashboard')

})


module.exports = router;
