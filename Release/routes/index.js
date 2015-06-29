var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.js');
var indexController = require('../controllers/index.js');

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Index'
    })
});

router.get('/callsign', function(req, res) {
    var callsign = req.query.name;
    indexController.createCallsignEjs(callsign, res);
});

router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/post_position', userController.postPosition);
router.get('/sessionVerify', userController.sessionVerify);
router.post('/register', userController.register);
router.get('/getSavedPosition', userController.getSavedPosition);
router.post('/changePassword', userController.changePassword);

router.get('/data', indexController.handleData);
router.get('/data_zoomout', indexController.handleZoomoutData);
router.get('/click', indexController.handleClick);

module.exports = router;
