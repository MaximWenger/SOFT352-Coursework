var WebSocketClient = require("websocket").client;

var client = new WebSocketClient();

client.on("connect", function(connection) {
  console.log("WebSocket connected");

  connection.on("message", function(message) {
    console.log("Received: " + message.utf8Data); //When recieved, do this.  
  });

  connection.sendUTF("Hello world, from the client");
});

client.connect("ws://localhost:9000");