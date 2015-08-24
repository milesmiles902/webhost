/*
Miles Taylor
localdatacenter.org
Raspberry Pi->Webhost->Browser
*/

//Website Setup
// Load requirements
var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);

//For IP reverse lookup
var satelize = require('satelize');

//For File read
var path = require('path'),
lineReader = require('line-reader');

//For time-zone deficit
var moment = require('moment-timezone'),
  parseFormat = require('moment-parseformat');

//For file-system
var fs = require('fs');

var currentData = {
  lastTemperatureIndoor: 0,
  lastTemperatureOutdoor: 0,
  lastAltitude: 0,
  lastHumidity: 0,
  lastPressure: 0,
  lastLumens: 0,
  lastHeatIndex: 0,
  dateLastInfo: 0
}

var dayData = { 
    maxIndoorTemp: 0,
    maxIndoorTempTime: 0,
    minIndoorTemp: 0,
    minIndoorTempTime: 0,
    maxOutdoorTemp: 0,
    maxOutdoorTempTime: 0,
    minOutdoorTemp: 0,
    minOutdoorTempTime: 0,
    maxHumidity: 0,
    maxHumidityTime: 0,
    minHumidity: 0,
    minHumidityTime: 0,
    maxHeatIndex: 0,
    maxHeatIndexTime: 0,
    minHeatIndex: 0,
    minHeatIndexTime: 0,
    maxPressure: 0,
    maxPressureTime: 0,
    minPressure: 0,
    minPressureTime: 0,
    maxAltitude: 0,
    maxAltitudeTime: 0,
    minAltitude: 0,
    minAltitudeTime: 0,
    maxLumens: 0,
    maxLumensTime: 0,
    minLumens: 0,
    minLumensTime: 0
}

//Get 
app.get('/', function(req, res){
  res.sendFile(path.resolve('../../public_html/default.html'));
  console.log("Sent webpage");

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  satelize.satelize(ip, function(err, data) {
      if(err){
        return;
      }
      var ipData = JSON.parse(data);
      console.log("New Client Connected");
      ipData["date"]= currentData.dateLastInfo;
      console.log(ipData);
      writeFile(JSON.stringify(ipData), "ip");
    });
});

app.use(express.static(path.join(path.resolve('../../public_html/'))));

http.listen(55555, function(){
  console.log('listening on *:55555');
});

//writeFile(dateLastInfo + " " + lastTemperatureIndoor + " " + lastTemperatureOutdoor + " " + lastHumidity + " " + lastHeatIndex + " " + lastPressure + " " + lastAltitude  + " " + lastLumens + "\n", "data");

io.sockets.on('connection', function(socket){

  socket.on('message', function(msg){ 
    currentData.lastTemperatureIndoor = msg.lastTemperatureIndoor;
    currentData.lastTemperatureOutdoor = msg.lastTemperatureOutdoor;
    currentData.lastAltitude = msg.lastAltitude;
    currentData.lastHumidity = msg.lastHumidity;
    currentData.lastPressure = msg.lastPressure;
    currentData.lastLumens = msg.lastLumens;
    currentData.lastHeatIndex = msg.lastHeatIndex;
    currentData.dateLastInfo = msg.dateLastInfo;
    writeFile(JSON.stringify(msg), "data");
  });

  socket.emit('browser', 
  {
    lastTemperatureIndoor: currentData.lastTemperatureIndoor,
    lastTemperatureOutdoor: currentData.lastTemperatureOutdoor,
    lastAltitude: currentData.lastAltitude,
    lastHumidity: currentData.lastHumidity,
    lastPressure: currentData.lastPressure,
    lastLumens: currentData.lastLumens,
    lastHeatIndex: currentData.lastHeatIndex,
    dateLastInfo: currentData.dateLastInfo 
  });
/*
  socket.emit('tables', 
  { 
    maxIndoorTemp: maxIndoorTemp,
    maxIndoorTempTime: maxIndoorTempTime,
    minIndoorTemp: minIndoorTemp,
    minIndoorTempTime: minIndoorTempTime,
    maxOutdoorTemp: maxOutdoorTemp,
    maxOutdoorTempTime: maxOutdoorTempTime,
    minOutdoorTemp: minOutdoorTemp,
    minOutdoorTempTime: minOutdoorTempTime,
    maxHumidity: maxHumidity,
    maxHumidityTime: maxHumidityTime,
    minHumidity: minHumidity,
    minHumidityTime: minHumidityTime,
    maxHeatIndex: maxHeatIndex,
    maxHeatIndexTime: maxHeatIndexTime,
    minHeatIndex: minHeatIndex,
    minHeatIndexTime: minHeatIndexTime,
    maxPressure: maxPressure,
    maxPressureTime: maxPressureTime,
    minPressure: minPressure,
    minPressureTime: minPressureTime,
    maxAltitude: maxAltitude,
    maxAltitudeTime: maxAltitudeTime,
    minAltitude: minAltitude,
    minAltitudeTime: minAltitudeTime,
    maxLumens: maxLumens,
    maxLumensTime: maxLumensTime,
    minLumens: minLumens,
    minLumensTime: minLumensTime
  });*/

  lineReader.eachLine('data/chat.json', function(line, last) {
    socket.emit('chat message', line);
      if (last){
        return false;
      }
  });

  socket.on('chat message', function(msg){
    console.log("Recieved chat message: " + msg);
    var dateMessage = dateLastInfo + ": " + msg;
    writeFile(dateMessage + "\n", "chat");
    io.emit('chat message', dateMessage);
  });
});

function writeFile(text, file){
  if (file === "data"){
    fs.appendFile('data/data.json', text, function(err){
      if(err){
        console.log("Write data.json error");
        throw err;
      }
    }); 
  }
  else if(file === "ip"){
    fs.appendFile('data/ip.json', text, function(err){
      if(err){
        console.log("Write data.json error");
        throw err;
      }
    });
  }
  else if(file === "chat"){
    fs.appendFile('data/chat.json', text, function (err){
      if(err){
        console.log("Write data.json error");
        throw err;
      }
    })
  }
  else {
    fs.appendFile('data/err.json', text, function (err){
      if(err){
        console.log("Write error, incorrect file?");
        throw err;
      }
    })
  }
}