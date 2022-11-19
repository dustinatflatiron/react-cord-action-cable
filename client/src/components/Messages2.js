import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { CardBody, ListGroup, ListGroupItem } from "reactstrap";
import {
  useActionCable,
  useChannel,
} from "@aersoftware/react-use-action-cable";

function Messages(props) {
  const { actionCable } = useActionCable("ws://localhost:3001/cable");
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const { id: channelId } = useParams();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      console.log("here");
      const res = await fetch(`/channels/${channelId}`);
      const data = await res.json();
      setMessages(data.messages);
    };

    getMessages();
  }, [channelId]);

  const updateMessages = (data) => {
    setMessages([...messages, data]);
  };

  useEffect(() => {
    subscribe(
      {
        channel: "ChannelsChannel",
        id: channelId,
      },
      {
        received: (data) => {
          console.log(messages);
          updateMessages(data);
        },

        connected: () => {
          console.log("connected");
        },
        disconnected: () => {
          console.log("disconnected");
        },
      }
    );
    return () => {
      unsubscribe();
    };
  }, [channelId, messages]);

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
          onClick={(e) =>
            send({
              action: "ping",
              payload: { content, channel_id: channelId },
            })
          }
        >
          Send!
        </button>
      </div>
      <ListGroup>
        {messages.map((message, index) => (
          <ListGroupItem key={index}>
            {message.user.username} : {message.content}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

export default Messages;
