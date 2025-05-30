import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import WebApp from "@twa-dev/sdk";

function App() {
  const tg = window.Telegram.WebApp;
  const [count, setCount] = useState(0); // Add counter state

  useEffect(() => {
    tg.ready(); // Inform Telegram the app is ready
    // Optional: Send a test message as soon as the app loads
    tg.sendData(
      JSON.stringify({
        event: "app_loaded",
        timestamp: new Date().toISOString(),
      })
    );
  }, [tg]);

  const handleSendData = () => {
    const testData = {
      message: "Hello from React Mini App!",
      timestamp: new Date().toISOString(),
      userAction: "button_click",
    };
    console.log("Sending data from frontend:", JSON.stringify(testData)); // For frontend debugging
    tg.sendData(JSON.stringify(testData));
  };

  // Initialize SDK features in useEffect
  React.useEffect(() => {
    // Initialize the MainButton
    WebApp.MainButton.setText("Send Data to Bot");
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(handleSendData);

    // Optional: Cleanup MainButton event listener when component unmounts
    return () => {
      WebApp.MainButton.offClick(handleSendData);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  // Function to increment count
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World! This is a Telegram Mini App.</p>
        <button onClick={handleSendData}>Send Test Data to Backend</button>
        {/* Counter Button and Display */}
        <div>
          <p>Count: {count}</p>
          <button onClick={incrementCount}>Increment Count</button>
        </div>
        <p>Telegram WebApp Version: {tg.version}</p>
        <p>Platform: {tg.platform}</p>
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
