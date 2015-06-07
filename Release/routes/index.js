var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.js');
var indexController = require('../controllers/index.js');

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Index'
    })
});

router.post('/photoUpload', function(req, res) {
    console.log(req.files);
    res.end("File uploaded.");
});

router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/post_position', userController.postPosition);
router.get('/sessionVerify', userController.sessionVerify);

router.get('/data', indexController.handleData);
router.get('/click', indexController.handleClick);

module.exports = router;
