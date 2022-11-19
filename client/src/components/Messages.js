import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { CardBody, ListGroup, ListGroupItem } from "reactstrap";
import { CableContext } from "../context/cable.js";
import { UserContext } from "../context/user";

function Messages(props) {
  const [user, setUser] = useContext(UserContext);
  const cableContext = useContext(CableContext);
  const { id: channelId } = useParams();

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const channelsChannel = useRef(null);

  //   useEffect(() => {
  //     const getMessages = async () => {
  //       console.log("here");
  //       const res = await fetch(`/channels/${channelId}`);
  //       const data = await res.json();
  //       setMessages(data.messages);
  //     };

  //     getMessages();
  //   }, [channelId]);

  useEffect(() => {
    channelsChannel.current = cableContext.cable.subscriptions.create(
      {
        channel: `ChannelsChannel`,
        id: channelId,
      },
      {
        // remember, the data being received and passed to the received callback
        // is an object structured like this: { message: "some message" }
        received: (data) => {
          setMessages((prevMessages) => {
            return Array.isArray(data) ? [...data] : [data, ...prevMessages];
          });
        },
        connected: () => console.log("connected"),
        disconnected: () => console.log("disconnected"),
      }
    );
    // return () => channelsChannel.current.unsubscribe();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // if (content !== "") {
    //   setContent("");
    //   fetch("/messages", {
    //     method: "POST",
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       content: content,
    //       channel_id: channelId,
    //     }),
    //   });
    // }
    channelsChannel.current.send({ content, channelId, userId: user.id });
    setContent("");
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
        <button onClick={(e) => handleSubmit(e)}>Send!</button>
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
