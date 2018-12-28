var WebSocketServer = require("websocket").server;
var http = require("http");
var readline = require("readline");
const uuidv4 = require('uuid/v4'); //produces random number

var server = http.createServer(function(request, response) {
  console.log(new Date() + " Received request");
});
server.listen(9000, function() {
  console.log(new Date() + " listening on port 9000");
});

wsServer = new WebSocketServer({
  httpServer: server
});

var connections = {}; //Factory pattern for each new connection

wsServer.on("request", function(request) {
  var connection = request.accept(null, request.origin);
  var id = uuidv4(); //assigns random number as the ID

  connection.on("close", function(reasonCode, description) {
    console.log("Closing a connection");
    delete connections[id];   // Delete the connection from the object once the client disconnects.
  });
  
  connection.on("message", function incoming(request) {
	 console.log("Received:hhhhhhhhhhhh ");
});

  // Add the new connection to the array of connections.
  connections[id] = connection;
  for (var id in connections) {
    connections[id].sendUTF("A new connection was made - now " + Object.keys(connections).length + " connected clients (" + connection.id + ")");
  }
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion() {
  rl.question("Enter a message ('quit' to end)", function(answer) {
    if (answer === 'quit') {
      return rl.close();
    }

    for (var id in connections) {
      connections[id].sendUTF("New message (obj): '" + answer + "'");
    }

    askQuestion(); //Never ending loop
  });  
}

playerFactory = { //Pratical 3 | Used to create new players
	create: function (pColor, pName, pId){
		var p;
		p = {
		'color': pColor,
		'name': pName,
		'Id': pId
		}
	return p;
	}
};

gameFactory = { //Used to create new game objects, using player objects
	create : function (pPlayer1, pPlayer2){
		var p;
		p = {
			'p1': pPlayer1,
			'p2': pPlayer2,
			'p1Score': 0,
			'p1Score': 0,
			'gmeTime': 0
		}
		return p;
	}
};

//ebSocketServer.onmessage = function(message){ //When get a message, do this
//    console.log("Received:hhhhhhhhhhhh ");
//}



askQuestion();