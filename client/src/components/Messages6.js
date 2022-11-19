import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { CardBody, ListGroup, ListGroupItem } from "reactstrap";
import { createConsumer } from "@rails/actioncable";
import {
  ActionCableProvider,
  ActionCableConsumer,
} from "react-actioncable-provider";

function Messages(props) {
  const { id: channelId } = useParams();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const cable = useRef();

  useEffect(() => {
    console.log("here");
    const getMessages = async () => {
      const res = await fetch(`/channels/${channelId}`);
      const data = await res.json();
      setMessages(data.messages);
    };

    getMessages();
  }, [channelId]);

  // ConversationPage.js
  // ...

  function handleSubmit(e) {
    e.preventDefault();
    // newMessage is the state variable
    // associated with our controlled form that
    // stores the message content typed by a user,
    // and loggedInUser is a state variable
    // containing data about a user stored on login
    // and passed down from App.js as a prop
    if (content !== "") {
      setContent("");
      fetch("/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          channel_id: channelId,
        }),
      });
    }
  }

  const handleReceived = (data) => {
    debugger;
  };

  return (
    <ActionCableProvider url="ws://localhost:3000/cable">
      <ActionCableConsumer
        channel={{ channel: "ChannelsChannel", id: channelId }}
        onReceived={handleReceived}
      >
        <div>
          <div>
            <textarea
              rows={10}
              placeholder={"Enter a message here ..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Send!
            </button>
          </div>
          <ListGroup>
            {messages !== [] &&
              messages.map((message, index) => (
                <ListGroupItem key={index}>
                  {message.user.username} : {message.content}
                </ListGroupItem>
              ))}
          </ListGroup>
        </div>
      </ActionCableConsumer>
    </ActionCableProvider>
  );
}

export default Messages;
