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

//const e = require("express");

//const label = document.getElementById("status-label");
//const textView = document.getElementById("text-view");
//const buttonSend = document.getElementById("send-button");
//const chat = document.getElementById("chat");
//const socket = io();
//
////socket.onopen = function (event) {
////  label.innerHTML = "Connection established";
////};
//
//socket.on("connect", function (event) {
//  label.innerHTML = "Connection established";
//
//  socket.send("Hello, server!");
//});
//
//socket.on("message", function (data) {
//  let p = document.createElement("p");
//  p.classList.add("message");
//  p.textContent = data;
//  chat.append(p);
//});
//
//socket.on("close", function (event) {
//  console.log("Connection closed");
//});

//const helperModule =(function(ids){
//  for(let id in ids){
//
//  }
//
//  return {
//    // Public method to find elements by specified ids
//    findElements(){
//
//    }
//  }
//})(ids)

const socket = (function () {
  // Private socket variable
  const socket = io();

  function sendMessage() {
    // Send message to the server
  }

  return {
    init: function () {
      socket.on("connect", function (event) {
        //socket.send("Hello, server!");
      });

      socket.on("message", function (messageData) {
        // Message Data is recieved as object
        messageData.isMyMessage = false;

        let messageRecievedEvent = new CustomEvent("socket:messageRecieved", {
          detail: messageData,
        });

        document.dispatchEvent(messageRecievedEvent);
      });

      document.addEventListener("chat:messageSent", function (event) {
        let detail = event.detail;

        detail.nickname =
          sessionStorage.nicknme || localStorage.nickname || "Unknown user";
        // Send message to the server
        socket.send(detail);
      });
    },
  };
})();

const chat = (function () {
  // Private form variable
  const form = document.getElementById("message-form");

  // Private chat variable
  const chat = document.getElementById("chat");

  // Private message input variable
  const messageInput = document.getElementById("message-input");

  // Private function displaying messages
  function displayMessage({
    messageText,
    isMyMessage,
    isServerMessage,
    nickname,
  }) {
    let message = document.createElement("div"),
      name = document.createElement("h3"),
      text = document.createElement("p"),
      time = document.createElement("time");

    message.classList.add("message");
    name.classList.add("name");
    text.classList.add("text");
    time.classList.add("time");

    text.textContent = messageText;
    time.textContent = moment().format("HH:mm");

    if (isMyMessage) {
      name.textContent = localStorage.nickname || "Unknown user";
      message.classList.add("my-message");
    } else if (isServerMessage) {
      message.classList.add("server-message");
      name.textContent = "Server";
    } else {
      name.textContent = nickname;

      message.classList.add("user-message");
    }

    message.append(name);
    message.append(text);
    message.append(time);

    chat.append(message);
  }

  return {
    init: function init() {
      // Event listener to submit messages
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        let messageText = messageInput.value;
        if (!messageText) return;

        let isMyMessage = true;

        displayMessage({ messageText, isMyMessage });

        // Emit custom event telling that new message was sent
        let messageSentEvent = new CustomEvent("chat:messageSent", {
          bubbles: true,
          detail: { messageText },
        });

        //let eventData = { messageText, username };
        form.dispatchEvent(messageSentEvent);
      });

      // Event listener to recieve messages
      document.addEventListener("socket:messageRecieved", function (event) {
        console.log("Message recieved!");
        displayMessage(event.detail);
      });
    },
  };
})();

const nickname = (function (formId) {
  // Private variable containing form
  const form = document.getElementById(formId);

  // Private function to check what is the error of the field
  function hasError(field) {
    let validity = field.validity;

    if (validity.valid) return;

    // If field is required and empty
    if (validity.valueMissing) return "Please fill out this field.";

    // If too short
    if (validity.tooShort)
      return `Nickname should be at least ${field.getAttribute(
        "minLength"
      )} characters long`;

    return "The value you entered for this field is invalid.";
  }

  // Private function to show errors
  function showError(field, error) {
    // Add error class to field
    field.classList.add("error");

    // Get field id or name
    let id = field.id || field.name;
    if (!id) return;

    // Check if error message field already exists
    // If not, create one
    let message = field.form.querySelector(".error-message#error-for-" + id);
    if (!message) {
      message = document.createElement("div");
      message.className = "error-message";
      message.id = "error-for-" + id;
      field.parentNode.insertBefore(message, field.nextSibling);
    }

    // Add ARIA role to the field
    field.setAttribute("aria-describedby", "error-for-" + id);

    // Update error message
    message.innerHTML = error;

    // Show error message
    message.style.display = "block";
    message.style.visibility = "visible";
  }

  // Private function to remove error
  function removeError(field) {
    // Remove error class to field
    field.classList.remove("error");

    // Remove ARIA role from the field
    field.removeAttribute("aria-describedby");

    // Get field id or name
    let id = field.id || field.name;
    if (!id) return;

    // Check if an error message is in the DOM
    let message = field.form.querySelector(
      ".error-message#error-for-" + id + ""
    );
    if (!message) return;

    // If so, hide it
    message.innerHTML = "";
    message.style.display = "none";
    message.style.visibility = "hidden";
  }

  // Private validation function
  function validate(field) {
    let error = hasError(field);

    if (error) {
      showError(field, error);
      return;
    }

    removeError(field);
  }

  return {
    // Public initiation method
    init: function () {
      form.setAttribute("novalidate", true);

      // Validate on blur
      form.addEventListener(
        "blur",
        function (event) {
          let field = event.target;

          if (
            field.disabled ||
            field.type === "file" ||
            field.type === "reset" ||
            field.type === "submit" ||
            field.type === "button" ||
            field.type === "checkbox"
          )
            return;

          validate(field);
        },
        true
      );

      // Validate on submit
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get all of the form elements
        let fields = event.target.elements;

        // Validate each field
        // Store the first field with an error to a variable so we can bring it into focus later
        let error, hasErrors;
        for (let i = 0; i < fields.length; i++) {
          error = hasError(fields[i]);
          if (error) {
            showError(fields[i], error);
            if (!hasErrors) {
              hasErrors = fields[i];
            }
          }
        }

        // If there are errors, don't submit form and focus on first element with error
        if (hasErrors) {
          hasErrors.focus();
          return;
        }

        if (form.remember.value) {
          localStorage.setItem("nickname", form.nickname.value);
        }
      });
    },
  };
})("nicknameForm");

//nickname.init();
//chat.init();

socket.init();
chat.init();
