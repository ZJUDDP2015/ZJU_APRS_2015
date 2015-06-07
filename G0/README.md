# Aprs project
    This project fetch online aprs data and show them on Baidu map 

##How to init database
    1.start mysql database service

    2.cmd: mysql -u "Your username" <BaiduMap\controllers\init.sql

#How to configurate your database setting
    1.copy DBconfig.default.json and rename it DBconfig.json

    2.change "user" and "password" in DBconfig.json

##How to fetch data and store them into database
    1.cmd: node app.js

    2.create a folder ../G2/log

    3.cmd: ../G2/Proxy.js

#How to access web page
    app.js has create a server listening port 3001
    
    web page url: localhost:3001
