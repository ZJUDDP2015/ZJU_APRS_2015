# Position Infomation
<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Meaning</th>
	</tr>
	<tr>
		<td>id</td>
		<td>long</td>
		<td>An auto-increasing id as primary key</td>
	</tr>
	<tr>
		<td>Path</td>
		<td>varchar(100) (stringified string array)</td>
		<td>a series of callsigns of digipeaters</td>
	</tr>
	<tr>
		<td>Source</td>
		<td>varchar(12)</td>
		<td>the callsign of the source</td>
	</tr>
	<tr>
		<td>Destination</td>
		<td>varchar(12)</td>
		<td>the callsign of the destination field</td>
	</tr>
	<tr>
		<td>Name</td>
		<td>varchar(12)</td>
		<td>the identifier of objects and items</td>
	</tr>
	<tr>
		<td>Time</td>
		<td>varchar(40)</td>
		<td>the time when the info is sent/received</td>
	</tr>
	<tr>
		<td>Latitude</td>
		<td>float</td>
		<td>the latitude of the object</td>
	</tr>
	<tr>
		<td>Longitude</td>
		<td>float</td>
		<td>the longitude of the object</td>
	</tr>
	<tr>
		<td>Comment</td>
		<td>varchar(255)</td>
		<td>contains the comment info including symbol</td>
	</tr>
</table>

# Weather Infomation
<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Meaning</th>
	</tr>
	<tr>
		<td>id</td>
		<td>long</td>
		<td>An auto-increasing id as primary key</td>
	</tr>
	<tr>
		<td>Type</td>
		<td>int</td>
		<td>The type of Weather Data</td>
	</tr>
	<tr>
		<td>Month</td>
		<td>int</td>
		<td>Time data: Month</td>
	</tr>
	<tr>
		<td>Day</td>
		<td>int</td>
		<td>Time data: Day</td>
	</tr>
	<tr>
		<td>Hour</td>
		<td>int</td>
		<td>Time data: Hour</td>
	</tr>
	<tr>
		<td>Min</td>
		<td>int</td>
		<td>Time data: Min</td>
	</tr>
	<tr>
		<td>Sec</td>
		<td>int</td>
		<td>Time data: Sec</td>
	</tr>
	<tr>
		<td>Lat</td>
		<td>float</td>
		<td>Latitute</td>
	</tr>
	<tr>
		<td>Longi</td>
		<td>float</td>
		<td>Longitude</td>
	</tr>
	<tr>
		<td>WindDirection</td>
		<td>int</td>
		<td>Wind Direction</td>
	</tr>
	<tr>
		<td>WindSpeed</td>
		<td>int</td>
		<td>The Speed of the wind</td>
	</tr>
	<tr>
		<td>WeatherUnit</td>
		<td>varchar(100)</td>
		<td>The description of weather device</td>
	</tr>
	<tr>
		<td>Gust</td>
		<td>int</td>
		<td>Gust</td>
	</tr>
	<tr>
		<td>Temp</td>
		<td>int</td>
		<td>Temperature</td>
	</tr>
	<tr>
		<td>RainLastHr</td>
		<td>int</td>
		<td>The amount of the rain fallen down in the last hour</td>
	</tr>
	<tr>
		<td>RainLast25Hr</td>
		<td>int</td>
		<td>The amount of the rain fallen down in the last 25 hour</td>
	</tr>
	<tr>
		<td>RainSinceMid</td>
		<td>int</td>
		<td>The amount of the rain fallen down since the last midnight</td>
	</tr>
	<tr>
		<td>Humidity</td>
		<td>int</td>
		<td>Humidity</td>
	</tr>
	<tr>
		<td>Barometric</td>
		<td>int</td>
		<td>Barometric</td>
	</tr>
	<tr>
		<td>Luminosity</td>
		<td>int</td>
		<td>Luminosity</td>
	</tr>
	<tr>
		<td>Path</td>
		<td>varchar(100) (stringified string array)</td>
		<td>a series of callsigns of digipeaters</td>
	</tr>
</table>
