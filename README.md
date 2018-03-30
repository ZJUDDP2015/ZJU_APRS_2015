# ZJU_APRS_2015

This project fetches online APRS(Automatic Packet Reporting System) data and displays them on Baidu map.


## Usage

### Newest code is in Release folder

Go to Release folder first.

```Shell
cd Release
```

### Init database

1. Start mysql database service

2. Type command:

```Shell
mysql -u "Your username" < init.sql
```

### Upgrade database

1. Read version number in `init.sql`

2. If version number is different from your old `init.sql`, run `DB_upgrade\convert_(oldversion)to(newversion)` to upgrade to new version. (if convert file is not available, drop database and init it again)

### Configurate your database setting

1. Copy `DBconfig.default.json` and rename it to `DBconfig.json`

2. Change `user` and `password` in `DBconfig.json`
    
### Package installation

1. Go to `Release` and run command `npm install`
	 
2. Go to `Release/public` and run command `bower install`

### Fetch data and store them into database

1. Type in command: `node Release/BaiduMap/app.js`

2. Create a folder `log` in Proxy

3. Type in command: `node Proxy/Proxy.js`

### Access web page

`app.js` has created a server listening on port 3001
    
web page url: `localhost:3001`
