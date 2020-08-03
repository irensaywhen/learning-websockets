const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const messages = require("./messages");
const albumRequestModule = require("/albumRequestModule");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.send(messages.greetings);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });

  socket.on("album request", (data) => {
    console.log(data);
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
