var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.js');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/changePassword', userController.changePassword);
router.get('/logout', userController.logout);
router.get('/get_position', userController.getSavedPosition, userController.getIPPosition);
router.post('/post_position', userController.postPosition);
router.get('/sessionVerify', userController.sessionVerify);

module.exports = router;
