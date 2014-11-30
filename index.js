
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var bodyParser = require('body-parser');
// var routes = require('./routes/index');
// var users = require('./routes/users');
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Uncomment these when finished!! ====================
// var arduino = require('duino');
// var board = new arduino.Board({
//     	device: "ACM",
//     });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'app/elements')));
//nRF chanels: 9-13 
// 0 9 10 11
// g 0 13 12
// _ _ [][]
// [][][][]

//Test Led object
function Led(pin, dev, index){
	this.pin = pin;
	this.state = false;
	this.dev = dev;
	this.index = index;
	// this.led = new arduino.Led({
	// 	board: board,
	// 	pin: pin
	// 	});
	this.toggle = function(){
		
		// if (this.state){
		// 	this.led.on();
		// }else{
		// 	this.led.off();
		// }
	}
};
var rel1 = new Led("4", "rel1", 0);
var rel2 = new Led("5", "rel2", 1);
var sw1 = new Led("6", "sw1", 2);
var sw2 = new Led("7", "sw2", 3);
var devs = [rel1, rel2, sw1, sw2];

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket){
	// console.log(" someone got connected");
	for (var i=0; i<devs.length; i++){
		socket.emit('status', {
			dev: devs[i].dev,
			state: devs[i].state
		})
	}
  socket.on('relay', function(msg){
  	// console.log(msg);
  	devs[msg.index].state = msg.state;
  	devs[msg.index].toggle();
  	socket.broadcast.emit('status', {
		dev: msg.dev,
		state: msg.state 
	});
  });
});

http.listen(7313, function(){
  console.log('listening on *:7313');
});

