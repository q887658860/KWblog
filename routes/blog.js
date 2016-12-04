var express = require('express');
var router = express.Router();

var restrict = require('../utility/restrict');

router.get('/index', function (req, res, next) {
    res.render('blog/index', {
        title: ' - All Articles'
    });
});

router.get('/show', function (req, res, next) {
    res.render('blog/show', {
        title: ' - Context'
    });
});

router.get('/create', restrict.isAuthenticated, function (req, res, next) {
    res.render('blog/create', {
        title: ' - New Article'
    });
});

router.get('/edit', restrict.isAuthenticated, function (req, res, next) {
    res.render('blog/edit', {
        title: ' - Edit'
    });
});

module.exports = router;