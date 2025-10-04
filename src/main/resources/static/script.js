let ws;
let username;
let receiver;
const connectedUsers = new Set();

window.onload = () => {
    const senderInput = document.getElementById("sender");
    const receiverInput = document.getElementById("receiver");
    const submitButton = document.getElementById("Submit");

    function validateInputs() {
        const senderVal = senderInput.value.trim();
        const receiverVal = receiverInput.value.trim();
        const validSender = checkUserName(senderVal);
        const validReceiver = checkUserName(receiverVal);

        if (senderVal === receiverVal) {
            submitButton.disabled = true;
        } else {
            submitButton.disabled = !(validSender && validReceiver);
        }
    }

    senderInput.addEventListener("input", validateInputs);
    receiverInput.addEventListener("input", validateInputs);

    submitButton.addEventListener("click", () => {
        const name = senderInput.value.trim();
        const rec = receiverInput.value.trim();

        if (!checkUserName(name)) {
            alert("Username must be at least 3 alphanumeric characters and start with a letter.");
            return;
        }
        if (!checkUserName(rec)) {
            alert("Receiver's username must be at least 3 alphanumeric characters and start with a letter.");
            return;
        }
        if (connectedUsers.has(name)) {
            alert("Username is already taken in this session. Please choose another.");
            return;
        }

        username = name;
        receiver = rec;
        connectedUsers.add(username);

        document.querySelector(".pop_up").style.display = "none";
        document.querySelector(".chat-container").style.display = "flex";

        setupWebSocket();
    });

    senderInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && !submitButton.disabled) submitButton.click();
    });
    receiverInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && !submitButton.disabled) submitButton.click();
    });
};

function checkUserName(name) {
    if (name.length < 3) {
        return false;
    }
    if (!/^[a-zA-Z]/.test(name)) {
        return false;
    }
    for (let i = 0; i < name.length; i++) {
        const ch = name.charAt(i);
        if (
            !(
                (ch >= 'a' && ch <= 'z') ||
                (ch >= 'A' && ch <= 'Z') ||
                (ch >= '0' && ch <= '9')
            )
        ) {
            return false;
        }
    }
    return true;
}

function setupWebSocket() {

        const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
        const backendHost = "chat-app-7frc.onrender.com";
        const url = `${protocol}://${backendHost}/chat?user=${encodeURIComponent(username)}`;

    ws = new WebSocket(url);

    ws.onopen = () => {
        insertMessage(`Connected as ${username}`);
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.sender === username) {
            addMessage(message.message, "sent");
        } else {
            if (message.sender === receiver) {
                addMessage(message.message, "received", message.sender);
            }
        }
    };

    ws.onclose = () => {
        insertMessage("Disconnected from the server.");
        connectedUsers.delete(username);
    };

    document.querySelector("button.send").onclick = sendMessage;
    document.getElementById("messageInput").addEventListener("keyup", e => {
        if (e.key === "Enter") sendMessage();
    });
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert("WebSocket is not connected.");
        return;
    }
    if (!receiver) {
        alert("No recipient specified.");
        return;
    }
    if (!messageText) return;

    const message = {
        sender: username,
        receiver: receiver,
        message: messageText,
    };

    ws.send(JSON.stringify(message));
    addMessage(messageText, "sent");
    messageInput.value = "";
}

function addMessage(text, type, sender = "") {
    const messageContainer = document.querySelector(".messages");
    const messageInfo = document.createElement("div");

    messageInfo.classList.add("message", type);
    if (type === "received" && sender) {
        messageInfo.textContent = `${sender}: ${text}`;
    } else {
        messageInfo.textContent = text;
    }

    messageContainer.appendChild(messageInfo);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function insertMessage(text) {
    const messageContainer = document.querySelector(".messages");
    const messageInfo = document.createElement("div");
    messageInfo.classList.add("system-message");
    messageInfo.textContent = text;
    messageContainer.appendChild(messageInfo);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
