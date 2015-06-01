create database if not exists weather;
create database if not exists moving_object;

use weather;
create table if not exists weather (
	id int not null AUTO_INCREMENT,
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
	Luminosity int,
	Path varchar(100),
	primary key(id)
	);

use moving_object;

create table if not exists moving_object (
	id int not null AUTO_INCREMENT,
	Path varchar(100),
	Source varchar(12),
	Destination varchar(12),
	Name varchar(12),
	Time varchar(40),
	Latitude float,
	Longitude float,
	Comment varchar(255),
	primary key(id)
	);
