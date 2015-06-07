# ZJU_APRS_2015
This is a APRS project for DDP course

Each group should create a new folder for their own task~

学长们加油 =w=

## June 2015

The assignments for this week:

1. 在服务器上长期运行 -->0
2. 可持续发布的部署包
3. 主页面以地图喂主要内容，右侧栏显示其他功能 -->0
4. 根据当前位置计算恰当的视图并读取正确范围的数据 -->0
5. 进入主页面时默认显示最近60分钟的数据 -->0
6. 显示静态位置的台站
7. 显示正确的图标
8. 地图小比例尺不显示具体台站
9. 在空白处点击取消数据显示
10. 数据显示中看comment数据，PHG和气象数据展开
11. 可查询某台站的最后位置和最后60分钟数据
12. 采用get方式获得某站台的最后位置和最后60分钟数据
13. 数据显示中的呼号为链接，指向12的URL

# Aprs project
    This project fetch online aprs data and show them on Baidu map 
    
## Now all the updates should be in Release folder
	So first we cd to Release folder

## How to init database
    1.start mysql database service

    2.cmd: mysql -u "Your username" <init.sql

## How to configurate your database setting
    1.copy DBconfig.default.json and rename it DBconfig.json

    2.change "user" and "password" in DBconfig.json

## How to fetch data and store them into database
    1.cmd: node Release/BaiduMap/app.js

    2.create a folder 'log' in G2

    3.cmd: node G2/Proxy.js

## How to access web page
    app.js has create a server listening port 3001
    
    web page url: localhost:3001
