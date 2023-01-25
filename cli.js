#!/usr/bin/env node

import moment from 'moment-timezone';
import fetch from 'node-fetch';
import minimist from 'minimist';

var args = minimist(process.argv.slice(2)); //taken directly from minimist site, but removed require at advice from error logs
let lat = 0;
let lon = 0;

// need to add the help text
if (args.h) {
	console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE');
	console.log('-h            Show this help message and exit.');
	console.log('-n, -s        Latitude: N positive; S negative.');
	console.log('-e, -w        Longitude: E positive; W negative.');
	console.log('-z            Time zone: uses tz.guess() from moment-timezone by default.');
	console.log('-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.');
	console.log('-j            Echo pretty JSON from open-meteo API and exit.');
	process.exit(0); // taken from https://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
}

// additional command arguments
if (args.n) { // pos
	lat = args.n;
}
else if (args.s) { // neg
	lat = -args.s;
}
else {
	console.log('Latitude must be in range');
}

if (args.e) {
	lon = args.e;
}
else if (args.w) {
	lon = -args.w;
}
else {
	console.log('Longitude must be in range');
}

// extract system timezone
const timezone = moment.tz.guess();

// Make a request with the URL from the API URL builder
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat
							+ '&longitude=' + lon
							+ '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_hours&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch'
							+ '&timezone=' + timezone);  //America%2FNew_York')

// Get the data from the request
const data = await response.json();		

//Create the response text using conditional statements
const days = args.d;
if (days == 0) {
	console.log('today.');
}
else if (days > 1) {
	console.log('in ' + days + ' days.');
}
else {
	console.log('tomorrow');
}


if (args.j) {
	console.log(data);
	process.exit(0);
}