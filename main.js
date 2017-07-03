var dir = require('node-dir');
var csv = require('ya-csv');
var path = require('path');
var moment = require('moment');

var writer = csv.createCsvFileWriter('./cleaned-up.csv', {
	separator: ',', // must remove in writeStream.write()
	quote: '',
	escape: ''
});

writer.writeRecord([
	'project', 
	'date', 
	'authors', 
	'commits', 
	'opened', 
	'closed', 
	'sent', 
	'senders', 
	'senders_365', 
	'percentage_senders_365', 
	'authors_365', 
	'percentage_authors_365'
	]);


var mappingMailingListToProject = {
	'paho-dev': "paho",
	'mosquitto-dev': "mosquitto",
	'cf-dev': "californium",
	'kura-dev': "kura",
	'leshan-dev': "leshan",
	'wakaama-dev': "wakaama",
	'hono-dev': "hono",
	'kapua-dev': "kapua",
	'tinydtls-dev': "tinydtls",
	'concierge-dev': "concierge",
	'smarthome-dev': "smarthome",
	'om2m-dev': "om2m",
	'milo-dev': "milo",
	'4diac-dev': "4diac",
	'scada-dev': "eclipsescada",
	'krikkit-dev': "krikkit",
	'hawkbit-dev': "hawkbit",
	'vorto-dev': "vorto",
	'whiskers-dev': "whiskers",
	'ponte-dev': "ponte",
	'edje-dev': "edje",
	'unide-dev': "unide",
	'risev2g-dev': "risev2g",
	'paho.incubator-dev': "paho"
}


var readerGIT = csv.createCsvFileReader('/Users/kartben/Downloads/[IOT] COMMITS MONTHLY.csv', {
	//	columnsFromHeader: true,
	'separator': ','
});

readerGIT.addListener('data', function(data) {
	if (this.parsingStatus.rows > 0) {
		data[0] = data[0].substr(4);
		data[1] = moment.unix(data[1]/1000).format('M/D/YYYY');
		writer.writeRecord(data);
	}
});

var readerML = csv.createCsvFileReader('/Users/kartben/Downloads/[IOT] MAILING LIST MONTHLY.csv', {
	//	columnsFromHeader: true,
	'separator': ','
});

readerML.addListener('data', function(data) {
	if (this.parsingStatus.rows > 0) {
		data[1] = moment.unix(data[1]/1000).format('M/D/YYYY');

		writer.writeRecord([mappingMailingListToProject[data[0]],data[1],
							null,null,null,null,
							data[2],data[3]]);
	}
});


var readerGITYearly = csv.createCsvFileReader('/Users/kartben/Downloads/[IOT] COMMITS YEARLY.csv', {
	//	columnsFromHeader: true,
	'separator': ','
});

readerGITYearly.addListener('data', function(data) {
	if (this.parsingStatus.rows > 0) {
		data[0] = data[0].substr(4);
		data[1] = moment(data[1].split(" to ")[1], "MMMM Do YYYY").format('M/D/YYYY');

		writer.writeRecord([data[0], data[1], 
			null, null, null, null, null, null, null, null, 
			data[2]]);
	}
});

var readerMLYearly = csv.createCsvFileReader('/Users/kartben/Downloads/[IOT] MAILING LIST YEARLY.csv', {
	//	columnsFromHeader: true,
	'separator': ','
});

readerMLYearly.addListener('data', function(data) {
	if (this.parsingStatus.rows > 0) {
		data[1] = moment(data[1].split(" to ")[1], "MMMM Do YYYY").format('M/D/YYYY');

		writer.writeRecord([mappingMailingListToProject[data[0]], data[1], 
			null, null, null, null, null, null, 
			data[3]]);
	}
});




var readerGerritOpened = csv.createCsvFileReader('/Users/kartben/Downloads/[IOT] GERRIT OPENED MONTHLY.csv', {
	//	columnsFromHeader: true,
	'separator': ','
});

readerGerritOpened.addListener('data', function(data) {
	if (this.parsingStatus.rows > 0) {
		data[0] = data[0].substr(4);
		data[1] = moment.unix(data[1]/1000).format('M/D/YYYY');

		writer.writeRecord([data[0],data[1],
							null,null,
							data[2]]);
	}
});

var readerGerritClosed = csv.createCsvFileReader('/Users/kartben/Downloads/[IOT] GERRIT CLOSED MONTHLY.csv', {
	//	columnsFromHeader: true,
	'separator': ','
});

readerGerritClosed.addListener('data', function(data) {
	if (this.parsingStatus.rows > 0) {
		data[0] = data[0].substr(4);
		data[1] = moment.unix(data[1]/1000).format('M/D/YYYY');

		writer.writeRecord([data[0],data[1],
							null,null,null,
							data[2]]);
	}
});






// finally make sure we have each project at least once each month
var allProjects = [

"4diac",
"californium",
"concierge",
"ditto",
"eclipsescada",
"edje",
"hawkbit",
"hono",
"kapua",
"krikkit",
"kura",
"leshan",
"milo",
"mosquitto",
"om2m",
"paho",
"paho.incubator",
"ponte",
"risev2g",
"smarthome",
"tinydtls",
"unide",
"vorto",
"wakaama",
"whiskers"

]

allProjects.forEach(function (p) {
	var m = moment("2012-01-01");
	while (m.isBefore(moment().startOf('month'))) {
   		 //console.log(m.format('M/D/YYYY'));
		 writer.writeRecord([p, m.format("M/D/YYYY"),0]);
	     m.add(1, 'month');
	}


});


