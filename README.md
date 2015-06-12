# ZJU_APRS_2015

    This project fetch online aprs data and show them on Baidu map
    
---
    
## Now all the updates should be in Release folder
	So first we cd to Release folder

## How to init database
    1.start mysql database service

    2.cmd: mysql -u "Your username" <init.sql

## How to configurate your database setting
    1.copy DBconfig.default.json and rename it DBconfig.json

    2.change "user" and "password" in DBconfig.json
    
## Remember to "npm install" and "bower install"
	 1.run cmd "npm install" in Release
	 
	 2.run cmd "bower install" in Release/public 

## How to fetch data and store them into database
    1.cmd: node Release/BaiduMap/app.js

    2.create a folder 'log' in G2

    3.cmd: node G2/Proxy.js

## How to access web page
    app.js has create a server listening port 3001
    
    web page url: localhost:3001
