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
var players = {}; // To store all current users
var games = {}; //To store all current games

wsServer.on("request", function(request) {
  var connection = request.accept(null, request.origin);
    var id = uuidv4(); //assigns random number as the ID


  connection.on("close", function(reasonCode, description) {
    console.log("Closing a connection");
    delete connections[id];   // Delete the connection from the object once the client disconnects.
  });
  


  // Add the new connection to the array of connections.
  connections[id] = connection;
  for (var id in connections) {
    connections[id].sendUTF("A new connection was made - now " + Object.keys(connections).length + " connected clients (" + connection.id + ")");
  }

    connection.on("message", function incoming(request) {		
        console.log(request.utf8Data);

		if (identifyMsg(request) == "player"){ //Confirming it's a new player joining			
			createPlayer(request, id);
		};
    });

});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//function askQuestion() {
 // rl.question("Enter a message ('quit' to end)", function(answer) {
 //   if (answer === 'quit') {
 //     return rl.close();
 //   }
//
//    for (var id in connections) {
//      connections[id].sendUTF("New message (obj): '" + answer + "'");
//    }

//    askQuestion(); //Never ending loop
 // });  
//}
function identifyMsg(message){//Used to identify the type of message sent from client
	var fullMsg = message.utf8Data;
	if (fullMsg.includes("~")){//Used to identfy is the message is a new user settings being recieved
		return "player";
	}
}
function startTicker(){
	console.log("Ticker ON");
	var timer = setInterval(main, 1000); //Calls the main function once a second.
}


function createPlayer(message, id){ //Creates new user object, using the users color and name
console.log("Creating player")
var color = getColor(message);
var name = getUserName(message);
    players[id] = playerFactory.create(color, name, id); //Creates new playerr object
    console.log(players[id].name + "Created");
}


function createGame(player1, player2){ //Creates a new Game object 
	var GId = uuidv4(); //Produces random ID
	games[GId] = gameFactory.create(player1, player2); //Creates new gameID
	
}

function beginGame(){
	var counter = 0;
	var P1;
	var P2;
	for (var i = 0; i < players.length; i++){ //Find the first two available players
		if (players[i].playing == 'N' || counter < 2){
			if (counter == 0){
			P1 = i;
			counter++;
			}
			else if (counter == 1){
				P2 = i;
				counter++;
				break;
			}
		}
	}
	console.log(players[P1].playing);
	console.log(players[P2].playing);
	players[P1].playing = 'Y';
	players[P2].playing = 'Y';
		console.log(players[P1].playing);
	console.log(players[P2].playing);
	//createGame(players[P1], players[P2]);
}

function getColor(message){ //Returns the user chosen colour
	var x = [];
	x = message.utf8Data;
	var color = "";
	for (var i = 3; i < x.length; i++){
		if (x[i] == "~"){
			break;
	}
		color = color + x[i];
	}
	return color;
}
function getUserName(message){ //Returns the userName given by the user
		var x = [];
	x = message.utf8Data;
	var userName = "";
	var lineFound = false;
	for (var i = 0; i < x.length; i++){
		if (x[i] == "~"){
			lineFound = true;
			
	}
	if (lineFound == true && x[i] != "~"){
		userName = userName + x[i];
	}
	}
	return userName;
}

playerFactory = { //Pratical 3 | Used to create new players
	create: function (pColor, pName, pId){
		var p;
		p = {
		'color': pColor,
		'name': pName,
		'Id': pId,
		'playing':'N'
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



function main(){
	console.log("Tick");
	console.log(players.length + ":Player length");
	if (players.length >= 2){
		console.log("Got to Main!")
		beginGame();
	}
}

startTicker();

