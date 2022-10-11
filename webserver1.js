var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8100",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
}); //require socket.io module and pass the http object (server)

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var sunsilk = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var tresme = new Gpio(27, 'in', 'both');
var ponds = new Gpio(22, 'in', 'both');
var fairnlovely = new Gpio(10, 'in', 'both');
http.listen(8081); //listen to port 8080

const express = require('express'); 

  
// Creating express object 
const app = express(); 

  
// Defining port number 
const PORT = 3000;                   

  
// Function to serve all static files 
// inside public directory. 

app.use(express.static('public'));   

app.use('/images', express.static('images'));  

  
// Server setup 
app.listen(PORT, () => { 

  console.log(`Running server on PORT ${PORT}...`); 
})


function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  sunsilk.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    console.log(value)
    //lightvalue = value;
    if(value==1){
    socket.emit('info', "sunsilk1"); //send button status to client
    }
    if(value==0){
    socket.emit('info', "sunsilk0"); //send button status to client
    }

  });
  
  //var lightvalueA = 0; //static variable for current status
  tresme.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    console.log(value)
    //lightvalueA = value;
    if (value==1){
    socket.emit('info', "tresme1"); //send button status to client
  }
if (value==0){
   socket.emit('info',"tresme0")
}
  });
 //var lightvalueA = 0; //static variable for current status
  ponds.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    console.log(value)
    //lightvalueA = value;
    if (value==1){
    socket.emit('info', "ponds1"); //send button status to client
  }
if (value==0){
   socket.emit('info',"ponds0")
}
  });

//var lightvalueA = 0; //static variable for current status
  fairnlovely.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    console.log(value)
    //lightvalueA = value;
    if (value==1){
    socket.emit('info', "fairnlovely1"); //send button status to client
  }
if (value==0){
   socket.emit('info',"fairnlovely0")
}
  });






  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    if (lightvalue != LED.readSync()) { //only change LED if status has changed
      LED.writeSync(lightvalue); //turn LED on or off
    }
  });
});

process.on('SIGINT', function () { //on ctrl+c
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});

