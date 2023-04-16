var input = document.getElementById("input");
var sendButton = document.getElementById("send-btn");
sendButton.addEventListener("click", () => {
  sendMessage();
});
input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
const sendMessage = () => {
    var message = input.value;
    if (message.trim() === "") {
        return
    }
    var chatBody = document.getElementById("chat-body");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");
    var messageText = document.createElement("p");
    messageText.textContent = message;
    var timestampElement = document.createElement("span");
    timestampElement.classList.add("timestamp");
    var now = new Date();
    var timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    timestampElement.textContent = timeString;
    messageElement.appendChild(messageText);
    messageElement.appendChild(timestampElement);
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
    input.value = "";
}