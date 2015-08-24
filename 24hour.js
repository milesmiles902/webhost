var lineReader = require('line-reader');
var day = 0;
var month = 0;
var year = 0;
var oldDate = 0;
var counter = false;
var maxIndoorTemp =  0;
var maxIndoorTempTime;
var minIndoorTemp =  0;
var minIndoorTempTime;
var maxOutdoorTemp =  0;
var maxOutdoorTempTime;
var minOutdoorTemp = 0;
var minOutdoorTempTime;
var maxHumidity = 0;
var maxHumidityTime;
var minHumidity = 0;
var minHumidityTime;
var maxHeatIndex = 0;
var maxHeatIndexTime;
var minHeatIndex = 0;
var minHeatIndexTime;
var maxPressure = 0;
var maxPressureTime;
var minPressure = 0;
var minPressureTime;
var maxAltitude = 0;
var maxAltitudeTime;
var minAltitude = 0;
var minAltitudeTime;
var maxLumens = 0;
var maxLumensTime;
var minLumens = 0;
var minLumensTime;
var twentyFour;


lineReader.eachLine('data/correctedData.json', function(line, last) {
	var jsonLine = JSON.stringify(line);
	var lineFixed = jsonLine.replace(/\n/g, "")
                                      .replace(/\'/g, "")
                                      .replace(/\"/g, "")
                                      .replace(/\,/g, "")
                                      .replace(/\&/g, "")
                                      .replace(/\r/g, "")
                                      .replace(/\\r/g, "")
                                      .replace(/\t/g, "")
                                      .replace(/\b/g, "")
                                      .replace(/\f/g, "");
	var lineData = lineFixed.split(" "); 
	month = lineData[1];
	year = lineData[3];
	if (day < lineData[2]){
		console.log("Made it in the initilizer");
		if (counter) {
			console.log("Got to another day");
			writeFile(oldDate + " " + maxIndoorTemp + " " + maxIndoorTempTime + " " + minIndoorTemp + " " + minIndoorTempTime + " " + maxOutdoorTemp + " " + maxOutdoorTempTime + " " + minOutdoorTemp  + " " + minOutdoorTempTime + " " + maxHumidity + " " + maxHumidityTime + " " + minHumidity + " "  + minHumidityTime + " " + maxHeatIndex + " " + maxHeatIndexTime + " " + minHeatIndex + " " + minHeatIndexTime + " " + maxPressure + " " + maxPressureTime + " " + minPressure + " " + minPressureTime + " " + maxAltitude + " " + maxAltitudeTime + " " + minAltitude + " " + minAltitudeTime + " " + maxLumens + " " + maxLumensTime + " " + minLumens + " " + minLumensTime + "\n");
			counter = false;
		}
		oldDate = lineData[0] + " " + lineData[1] + " " + lineData[2];
		day = lineData[2];
		maxIndoorTemp = lineData[5];
		maxIndoorTempTime = lineData[4];
		minIndoorTemp = lineData[5];;
		minIndoorTempTime = lineData[4];
		maxOutdoorTemp = lineData[6];;
		maxOutdoorTempTime = lineData[4];
		minOutdoorTemp = lineData[6];
		minOutdoorTempTime = lineData[4];
		maxHumidity = lineData[7];
		maxHumidityTime = lineData[4];
		minHumidity = lineData[7];
		minHumidityTime = lineData[4];
		maxHeatIndex = lineData[8];
		maxHeatIndexTime = lineData[4];
		minHeatIndex = lineData[8];
		minHeatIndexTime = lineData[4];
		maxPressure = lineData[9];
		maxPressureTime = lineData[4];
		minPressure = lineData[9];
		minPressureTime = lineData[4];
		maxAltitude = lineData[10];
		maxAltitudeTime = lineData[4];
		minAltitude = lineData[10];
		minAltitudeTime = lineData[4];
		maxLumens = lineData[11];
		maxLumensTime = lineData[4];
		minLumens = lineData[11];
		minLumensTime = lineData[4];
		counter = true;
	}
	if(maxIndoorTemp < lineData[5]){
		maxIndoorTemp = lineData[5];
		maxIndoorTempTime = lineData[4];
	}
	if(minIndoorTemp > lineData[5]){
		minIndoorTemp = lineData[5];
		minIndoorTempTime = lineData[4];
	}
	if(maxOutdoorTemp < lineData[6]){
		maxOutdoorTemp = lineData[6];
		maxOutdoorTempTime = lineData[4];
	}
	if(minOutdoorTemp > lineData[6]){
		minOutdoorTemp = lineData[6];
		minOutdoorTempTime = lineData[4];
	}
	if(maxHumidity < lineData[7]){
		maxHumidity = lineData[7];
		maxHumidityTime = lineData[4];
	}
	if(minHumidity > lineData[7]){
		minHumidity = lineData[7];
		minHumidityTime = lineData[4];
	}
	if(maxHeatIndex < lineData[8]){
		maxHeatIndex = lineData[8];
		maxHeatIndexTime = lineData[4];
	}
	if(minHeatIndex > lineData[8]){
		minHeatIndex = lineData[8];
		minHeatIndexTime = lineData[4];
	}
	if(maxPressure < lineData[9]){
		maxPressure = lineData[9];
		maxPressureTime = lineData[4];
	}
	if(minPressure > lineData[9]){
		minPressure = lineData[9];
		minPressureTime = lineData[4];
	}
	if(maxAltitude < lineData[10]){
		maxAltitude = lineData[10];
		maxAltitudeTime = lineData[4];
	}
	if(minAltitude > lineData[10]){
		minAltitude = lineData[10];
		minAltitudeTime = lineData[4];
	}
	if(maxLumens < lineData[11]){
		maxLumens = lineData[11];
		maxLumensTime = lineData[4];
	}
	if(minLumens > lineData[11]){
		minLumens = lineData[11];
		minLumensTime = lineData[4];
	}

 	if(last === line){
 		return false;
 	}
});

var fs = require('fs');
function writeFile(text){
	fs.appendFile('data/august.json', text, function(err){
		if (err) {
			console.warn(err);
		}
	});
}
