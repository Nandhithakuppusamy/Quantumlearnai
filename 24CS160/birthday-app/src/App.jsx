import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [greeting, setGreeting] = useState("");

  function createGreeting() {
    if (name.trim() === "" || message.trim() === "") {
      setGreeting("Please enter all the details.");
    } else {
      setGreeting(`Happy Birthday, ${name}! ${message}`);
    }
  }

  return (
    <div className="page">
      <div className="birthday-card">

        <div className="icon">🎂</div>

        <h1>Birthday Wishes</h1>
        <p className="subtitle">
          Create a special message for someone special
        </p>

        <div className="form-group">
          <label>Birthday Person</label>
          <input
            type="text"
            placeholder="Enter their name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Your Message</label>
          <textarea
            placeholder="Write your heartfelt birthday wish..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button onClick={createGreeting}>
          Create Birthday Wish ✨
        </button>

        {greeting && (
          <div className="greeting-box">
            <span>🎉</span>
            <h2>Your Birthday Wish</h2>
            <p>{greeting}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;