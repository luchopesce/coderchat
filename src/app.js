import express from "express";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";

const app = express();
let messages = []

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/../src/public"));
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

const io = new Server(httpServer); 
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`New client connected with id: ${socket.id}`);

  socket.on('new-user', (username)=>{
    socket.emit('messages', messages)
    socket.broadcast.emit('new-user', username)
  })

  socket.on('chat-message', (data)=>{
    messages.push(data)
    console.log(messages)
    io.emit('messages', messages)
  })
});
