var mysql = require('mysql');
var request = require('request');
var client = mysql.createConnection(require("../DBconfig.json"));
var crypto = require('crypto');

exports.register = function(req, res) {
    console.log(req.url);
    console.log('e-mail= ' + req.body.email);
    console.log('password= ' + req.body.pw);
    console.log('confirm pw = ' + req.body.repw);

    if (req.body.email.length === 0) {
        return res.json({
            code: 1,
            message: "Empty e-mail"
        });
    }
    if (req.body.pw.length < 6) {
        return res.json({
            code: 2,
            message: "Password too short"
        });
    }
    if (req.body.pw != req.body.repw) {
        return res.json({
            code: 3,
            message: "Password confirm error"
        });
    }
    client.query('SELECT * FROM user WHERE email=?', [req.body.email],
        function(err, row, fields) {
            if (err) {
                throw err;
            }
            if (row[0]) {
                console.log(row);
                return res.json({
                    code: 4,
                    message: "Registered e-mail"
                });
            } else {
                hashedPassword = crypto.createHash('md5').update(req.body.pw).digest('hex');
                client.query('INSERT INTO user(email, password)' +
                    'VALUES(?,?)', [req.body.email, String(hashedPassword)]);
                return res.json({
                    code: 0,
                    message: "Register success"
                });
            }
        });
}

exports.login = function(req, res) {
    console.log('>>>>>>>>>>>>>>url= ' + req.url);
    console.log('>>>>>>>>>>>>>>e-mail= ' + req.body.email);
    console.log('>>>>>>>>>>>>>>password= ' + req.body.pw);
    
    exports.loginmail = req.body.email;

    if (req.body.email.length === 0) {
        return res.json({
            code: 1,
            message: "Empty e-mail"
        });
    }
    client.query('SELECT * FROM user WHERE email=?', [req.body.email],
        function(err, row, fields) {
            if (err) {
                throw err;
            }
            if (row[0]) {
                hashedPassword = crypto.createHash('md5').update(req.body.pw).digest('hex');
                if (row[0].password != String(hashedPassword))
                    return res.json({
                        code: 5,
                        message: "Wrong password"
                    });
                else {
                    req.session.email = req.body.email;
                    console.log('!!!!!!!!!!!!!!!Email Set!!!!!!!!!!!!!!!!!!!! ' + req.session.email + ' ' + req.body.email);
                    return res.json({
                        code: 0,
                        message: "Login success"
                    });
                }
            } else {
                return res.json({
                    code: 6,
                    message: "Email does not exist"
                });
            }
        });
}

exports.changePassword = function(req, res) {
    console.log(req.url);
    console.log('e-mail= ' + req.session.email);
    console.log('old password= ' + req.body.opw);
    console.log('new password= ' + req.body.npw);
    console.log('new password= ' + req.body.renpw);

    if (req.body.npw.length < 6) {
        return res.json({
            code: 2,
            message: "Password too short"
        });
    }
    if (req.body.npw != req.body.renpw) {
        return res.json({
            code: 3,
            message: "Password confirm error"
        });
    }
    client.query('SELECT * FROM user WHERE email=?', [req.session.email],
        function(err, row, fields) {
            if (err) {
                throw err;
            }
            if (row[0]) {
                hashedPassword = crypto.createHash('md5').update(req.body.opw).digest('hex');
                if (row[0].password != String(hashedPassword))
                    return res.json({
                        code: 5,
                        message: "Wrong password"
                    });
        }
    });
    client.query('UPDATE user SET password=? WHERE email=?', [crypto.createHash('md5').update(req.body.npw).digest('hex'), req.session.email],
        function(err, row, fields) {
            if (err) {
                throw err;
            }
            return res.json({
                code: 0,
                message: "Change password success"
            });
        });
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        if (!err) {
            return res.json({
                code: 0,
                message: "Log out success"
            });
        }
    });
}

exports.getSavedPosition = function(req, res, next) {
    if (req.session.email) {
        client.query('SELECT * FROM user WHERE email=?', [req.session.email],
            function(err, row, fields) {
                if (err) {
                    console.log('err');
                    throw err;
                } else if (!row[0].mapCenterX)
                    next()
                else return res.json({
                    code: 0,
                    message: "Location get success",
                    px: row[0].mapCenterX,
                    py: row[0].mapCenterY
                });
            });
    } else {
        next();
    }
}

exports.getIPPosition = function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    request('http://getcitydetails.geobytes.com/GetCityDetails?fqcn=' + ip,
        function(error, response, body) {
            body = JSON.parse(body);
            return res.json({
                code: 0,
                message: "Location get success",
                px: body['geobyteslatitude'],
                py: body['geobyteslongitude']
            });
        });
}

exports.postPosition = function(req, res) {
    if (req.session.email) {
        console.log(req.body);
        console.log(req.session.email);
        client.query('UPDATE user SET mapCenterX=?, mapCenterY=? WHERE email=?', [req.body.px, req.body.py, req.session.email],
            function(err, row, fields) {
                if (err) {
                    throw err;
                } else return res.json({
                    code: 0,
                    message: "Update position success"
                });
            });
    } else return res.json({
        code: 8,
        message: "Not logged in"
    });
}

exports.sessionVerify = function(req, res) {
    if (req.session.email) {
        console.log('verify! ' + req.session.email);
        return res.json({
            code: 7,
            message: "Logged in"
        });
    } else return res.json({
        code: 8,
        message: "Not logged in"
    });
}
