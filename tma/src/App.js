import React from "react";
import logo from "./logo.svg";
import "./App.css";
import WebApp from "@twa-dev/sdk";

function App() {
  const handleSendData = () => {
    WebApp.sendData("Hello from React Mini App!");
    WebApp.MainButton.setText("Data Sent!");
  };

  // Initialize the MainButton
  WebApp.MainButton.setText("Send Data to Bot");
  WebApp.MainButton.show();
  WebApp.MainButton.onClick(handleSendData);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World! This is a Telegram Mini App.</p>
        <button onClick={handleSendData}>Send Data to Bot</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
