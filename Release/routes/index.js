var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.js');
var indexController = require('../controllers/index.js');

var getFormatedTime = function(month, day, hour, minute) {
    var stime = "2015";
    if (hour < 0) {
        hour += 24;
        day--;
    }
    stime += '-' + (month < 10 ? '0' + month : month);
    stime += '-' + (day < 10 ? '0' + day : day);
    stime += ' ' + (hour < 10 ? '0' + hour : hour);
    stime += ':' + (minute < 10 ? '0' + minute : minute) + ':00';
    return stime;
}

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Index',
        starttime: '',
        endtime: '',
        callsign: ''
    })
});

router.get('/path', function(req, res) {
    var callsign_name = req.query.name;
  //indexController.createCallsignEjs(callsign, res);
    res.render('index',{
        starttime: getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours()-1, (new Date()).getMinutes()),//初始化时间(开始时间为当前一天前)
        endtime: getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours(), (new Date()).getMinutes()),
        callsign: callsign_name
    })
    console.log(starttime);
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
