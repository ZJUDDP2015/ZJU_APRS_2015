CREATE DATABASE IF NOT EXISTS aprs;

USE aprs;

CREATE TABLE IF NOT EXISTS weather (
	id int NOT NULL AUTO_INCREMENT,
	Type int,
	Month int,
	Day int,
	Hour int,
	Min int,
	Sec int,
	Lat  float,
	Longi float,
	WindDirection float,
	WindSpeed float,
	WeatherUnit varchar(100),
	Gust int,
	Temp int,
	RainLastHr int,
	RainLast24Hr int,
	RainSinceMid int,
	Humidity int,
	Barometric int,
	LUMINOSITY INT,
	Path varchar(100),
	Grid_latitude int,
	Grid_longitude int,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS moving_object (
	id int NOT NULL AUTO_INCREMENT,
	Path varchar(100),
	Source varchar(12),
	Destination varchar(12),
	Name varchar(12),
	Time datetime,
	Latitude float,
	Longitude float,
	Comment varchar(255),
	PRIMARY KEY(id)
);

ALTER TABLE `moving_object` ADD INDEX(`Grid_longitude`);
ALTER TABLE `moving_object` ADD INDEX(`Grid_latitude`);
ALTER TABLE `moving_object` ADD INDEX(`Time`);

CREATE TABLE `user` (
	id int(11) NOT NULL AUTO_INCREMENT,
	email varchar(30) DEFAULT NULL,
	password varchar(20) DEFAULT NULL,
	mapCenterX varchar(20) DEFAULT NULL,
	mapCenterY varchar(20) DEFAULT NULL,
	bannerImage varchar(50) DEFAULT NULL,
	bannerWord varchar(50) DEFAULT NULL,
	bannerWordSize varchar(20) DEFAULT NULL,
	bannerWordColor varchar(20) DEFAULT NULL,
	bannerWordFont varchar(20) DEFAULT NULL,
	PRIMARY KEY (id)
);
