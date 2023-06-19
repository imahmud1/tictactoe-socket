const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the static files from the "public" directory
app.use(express.static("public"));

io.on("connection", (socket) => {
  // Event handler for player moves
  socket.on("playerMove", (data) => {
    // Broadcast the move to all connected clients except the sender
    socket.broadcast.emit("opponentMove", data);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
