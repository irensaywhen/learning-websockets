//window.onload = function () {
//  if (window.WebSocket) {
//    const socket = new WebSocket("ws://echo.websocket.org");
//    const label = document.getElementById("status-label");
//    const textView = document.getElementById("text-view");
//    const buttonSend = document.getElementById("send-button");
//    const buttonStop = document.getElementById("stop-button");
//
//    socket.onopen = function (event) {
//      label.innerHTML = "Connection established";
//    };
//
//    socket.onmessage = function (event) {
//      if (typeof event.data === "string") {
//        label.innerHTML += `<br /> ${event.data}`;
//      }
//    };
//
//    socket.onclose = function (event) {
//      console.log("Connection closed");
//
//      let { code, reason, wasClean } = event;
//
//      wasClean
//        ? (label.innerHTML = "Connection closed normally")
//        : (label.innerHTML = `Connection closed with message ${reason}. Code: ${code}`);
//    };
//
//    socket.onerror = function (event) {
//      console.log("Error occured");
//
//      label.innerHTML = `Error: ${event}`;
//    };
//
//    buttonSend.onclick = function () {
//      if (socket.readyState === WebSocket.OPEN) {
//        socket.send(textView.value);
//      }
//    };
//
//    buttonStop.onclick = function () {
//      if (socket.readyState === WebSocket.OPEN) {
//        socket.close(1000, "Deliberate disconnection");
//      }
//    };
//  } else {
//    console.log("WebSockets are not supported");
//  }
//};

const label = document.getElementById("status-label");
const textView = document.getElementById("text-view");
const buttonSend = document.getElementById("send-button");
const chat = document.getElementById("chat");
const socket = io();

//socket.onopen = function (event) {
//  label.innerHTML = "Connection established";
//};

socket.on("connect", function (event) {
  label.innerHTML = "Connection established";

  socket.send("Hello, server!");
});

socket.on("message", function (data) {
  let p = document.createElement("p");
  p.classList.add("message");
  p.textContent = data;
  chat.append(p);
});

socket.on("close", function (event) {
  console.log("Connection closed");
});
