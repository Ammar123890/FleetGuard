// NPM Packages
const socketIO = require("socket.io");


module.exports = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("New client connected");

    //all socket.io logic goes here

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};