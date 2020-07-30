if (window.WebSocket) {
  const socket = new WebSocket("ws://echo.websocket.org");
  const label = document.getElementById("status-label");

  socket.onopen = function (event) {
    label.innerHTML = "Connection established";
  };

  socket.onmessage = function (event) {
    label.innerHTML = event.data;
  };
} else {
  console.log("WebSockets are not supported");
}
