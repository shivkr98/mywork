const morgan = require("morgan");
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const socket = require("socket.io")

const app = express();
var server1 = app.listen(8810);
const server = http.createServer(app);
const io = socketio(server).listen(server1);




app.use(morgan("dev"));
app.use(bodyParser.json());



mongoose.Promise = global.Promise;
const db = require("./keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


  
app.use("/users", require("./router/users"));
app.use("/post", require("./router/post"));
app.use("/block", require("./router/block"));


io.use((socket, next) => {
  header = socket.handshake.query.authorization;
  console.log(header);

  
  next();
});


io.on("connection", function (socket) {
  

  socket.on("like" , (imageId)=>{
    let imageid = imageId
    socket.emit("message", { message: "someone like your Image", imageid });
  })



})


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));