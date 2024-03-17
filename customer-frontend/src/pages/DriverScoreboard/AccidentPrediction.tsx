// MyComponent.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const AccidentPrediction = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish connection to the socket server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Cleanup function to disconnect the socket when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Run only once on component mount

  const handleSendEvent = () => {
    // Check if socket is connected before emitting an event
    if (socket && socket.connected) {
      socket.emit('myEvent', { data: 'Hello from client!' });
    } else {
      console.log('Socket is not connected.');
    }
  };

  return (
    <div>
      <h2>Socket.io Example</h2>
      <button onClick={handleSendEvent}>Send Event</button>
    </div>
  );
};

export default AccidentPrediction;
