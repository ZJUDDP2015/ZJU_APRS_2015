var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.js');

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('user', {
        title: 'User'
    });
});

router.get('/login', function(req, res) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/changePassword', userController.changePassword);
router.get('/logout', userController.logout);
router.get('/get_position', userController.getSavedPosition, userController.getIPPosition);
router.post('/post_position', userController.postPosition);
router.get('/sessionVerify', userController.sessionVerify);

module.exports = router;
