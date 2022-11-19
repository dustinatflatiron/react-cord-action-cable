import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { CardBody, ListGroup, ListGroupItem } from "reactstrap";
import { createConsumer } from "@rails/actioncable";

function Messages(props) {
  const { id: channelId } = useParams();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const cable = useRef();

  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch(`/channels/${channelId}`);
      const data = await res.json();
      debugger;
      setMessages(data.messages);
    };

    getMessages();
  }, [channelId]);

  useEffect(() => {
    if (!cable.current) {
      cable.current = createConsumer("ws://localhost:3000/cable");
    }

    const paramsToSend = {
      channel: "ChannelsChannel",
      id: channelId,
    };

    const handlers = {
      received(data) {
        debugger;
        console.log("here");
        setMessages([...messages, data]);
      },

      connected() {
        console.log("connected");
      },

      disconnected() {
        console.log("disconnected");
        cable.current = null;
      },
    };

    const subscription = cable.current.subscriptions.create(
      paramsToSend,
      handlers
    );
    return () => {
      console.log("unsubbing from ", channelId);
      cable.current = null;
      subscription.unsubscribe();
    };
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

  return (
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
  );
}

export default Messages;
