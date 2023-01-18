import React, { useState, useRef } from "react";
import io from "socket.io-client";
import "./style.css";

const socket = io.connect("http://localhost:3001");

const SocketIo = () => {
  const [style, setStyle] = useState({});
  const [usernameStyle, setUsernameStyle] = useState({});
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatboxinput, setChatboxinput] = useState("");
  const chatboxInputRef = useRef();

  socket.on("message", (message) => {
    setChats([...chats, message]);
  });

  socket.on("users", function (_users) {
    setUserList(_users);
  });

  const hideEnterHandler = () => {
    setStyle({
      display: "none",
    });
  };

  const hideEnterUsernameHandler = () => {
    setUsernameStyle({
      display: "none",
    });
  };

  function messageSubmitHandler(e) {
    e.preventDefault();

    if (!chatboxinput) return;

    let message = {
      text: chatboxinput,
      sender: socket.id,
    };

    socket.emit("message", message);

    setChatboxinput("");

    chatboxInputRef.current.value = "";
  }

  function userAddHandler(e) {
    e.preventDefault();

    if (!username) {
      return alert("You must add a user name");
    }

    socket.emit("adduser", username);

    hideEnterUsernameHandler();
  }

  return (
    <div>
      <div style={style} className="login">
        <button onClick={hideEnterHandler} className="login-btn">
          Click To Enter
        </button>
      </div>
      <div style={usernameStyle} className="backdrop"></div>
      <form style={usernameStyle} className="modal" onSubmit={userAddHandler}>
        <h1 id="title">Welcome</h1>
        <br />
        <p id="content">Enter Your UserName</p>
        <br />

        <input
          placeholder="Enter User Name"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <button>Submit</button>
      </form>
      <div className="container">
        <div className="chatbox">
          <ul id="messagelist">
            {chats.map((item, i) => {
              if (socket.id === item.message.sender) {
                return (
                  <li key={i} id="sender-messages">
                    <div style={{ background: "white" }} id="sender-messages2">
                      <p>{item.user}</p>
                      <p>{item.message.text}</p>
                    </div>
                  </li>
                );
              } else {
                return (
                  <li id="receiver-messages">
                    <div id="receiver-messages2">
                      <p>{item.user}</p>
                      <p>{item.message.text}</p>
                    </div>
                  </li>
                );
              }
            })}
          </ul>
          <form onSubmit={messageSubmitHandler} className="Input">
            <input
              // value={chatboxinput}
              ref={chatboxInputRef}
              onChange={(e) => setChatboxinput(e.target.value)}
              type="text"
              placeholder="Type your message ..."
            />
            <button>Send</button>
          </form>
        </div>
        <br />
        <div className="activeusers">
          <h2>Active Users</h2>
          <ul id="users">
            {userList.map((user, i) => {
              return <li key={i}>{user}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocketIo;
