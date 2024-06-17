class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
    };

    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, chatBox, sendButton } = this.args;

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.onSendButton(chatBox));

    const node = chatBox.querySelector("input");
    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.onSendButton(chatBox);
      }
    });
  }

  toggleState(chatbox) {
    this.state = !this.state;

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    this.messages.push(msg1);

    let typingMsg = {
      name: "Sam",
      message:
        '<div class="chat-bubble"><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>',
    };
    this.messages.push(typingMsg);
    this.updateChatText(chatbox);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let data = JSON.stringify({
      body: text1,
    });

    fetch("http://127.0.0.1:5000", {
      method: "POST",
      headers: myHeaders,
      body: data,
      redirect: "follow",
      mode: "cors",
    })
      .then((r) => r.json())
      .then((r) => {
        setTimeout(() => {
          this.messages.pop();
          let msg2 = { name: "Sam", message: "" };
          this.messages.push(msg2);
          let response = r;
          let i = 0;
          let typingEffect = setInterval(() => {
            if (i < response.length) {
              msg2.message += response.charAt(i);
              this.updateChatText(chatbox);
              i++;
            } else {
              clearInterval(typingEffect);
            }
          }, 20); // Adjust typing speed as needed
          textField.value = "";
        }, "1000");
      })
      .catch((error) => {
        console.error("Error:", error);
        this.updateChatText(chatbox);
        textField.value = "";
      });
  }

  updateChatText(chatbox) {
    var html = "";
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === "Sam") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
  }
}

const chatbox = new Chatbox();
chatbox.display();
