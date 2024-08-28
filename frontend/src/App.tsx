import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const ws = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws.current && input.trim()) {
      ws.current.send(`${name}:- ${input}`);
      setMessages((prevMessages) => [...prevMessages, input]);
      setInput('');
    }
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000');
    ws.current.onmessage = (event) => {
      event.data.text().then((text) => {
        setMessages((prevMessages) => [...prevMessages, text]);
      });
    }
    ws.current.onopen = () => {
      console.log('Connected to the WebSocket server');
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      ws.current.close();
    };
  },[]);

console.log("messages",messages)
  return (
    <div className="App">
      <h1>Chat Application</h1>
      <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type Your Name"
        />
      <div className="chat-box">
      {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default App
