import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import WebApp from "@twa-dev/sdk";

function App() {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we're in Telegram Web App environment
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const tg = window.Telegram.WebApp;

      try {
        tg.ready();
        setIsReady(true);

        // Wait a bit before sending data to ensure WebApp is fully ready
        setTimeout(() => {
          if (tg.isExpanded || tg.version) {
            const initData = JSON.stringify({
              event: "app_loaded",
              timestamp: new Date().toISOString(),
              user_id: tg.initDataUnsafe?.user?.id || "unknown",
            });
            console.log("Attempting to send data to bot (on load):", initData);
            tg.sendData(initData);
          }
        }, 1000);
      } catch (err) {
        setError(`WebApp initialization error: ${err.message}`);
        console.error("WebApp error:", err);
      }
    } else {
      setError("Not running in Telegram WebApp environment");
      console.warn("Telegram WebApp not available");
    }
  }, []);

  const handleSendData = () => {
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const tg = window.Telegram.WebApp;
      const testData = {
        message: "Hello from React Mini App!",
        timestamp: new Date().toISOString(),
        userAction: "button_click",
        user_id: tg.initDataUnsafe?.user?.id || "unknown",
      };

      try {
        const dataStr = JSON.stringify(testData);
        console.log("Attempting to send data from button click:", dataStr);
        tg.sendData(dataStr);

        // Also try showing notification
        tg.showAlert("Data sent to bot!");
      } catch (err) {
        console.error("Error sending data:", err);
        setError(`Send error: ${err.message}`);
      }
    } else {
      console.error("Telegram WebApp not available");
      setError("Telegram WebApp not available");
    }
  };

  // Initialize SDK features
  React.useEffect(() => {
    if (
      isReady &&
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      try {
        const tg = window.Telegram.WebApp;

        // Initialize the MainButton
        tg.MainButton.setText("Send Data to Bot");
        tg.MainButton.show();
        tg.MainButton.onClick(handleSendData);

        return () => {
          tg.MainButton.offClick(handleSendData);
        };
      } catch (err) {
        console.error("MainButton setup error:", err);
      }
    }
  }, [isReady]);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const tg =
    typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp
      ? window.Telegram.WebApp
      : null;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World! This is a Telegram Mini App.</p>

        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!isReady && !error && <p>Initializing Telegram WebApp...</p>}
        {isReady && <p style={{ color: "green" }}>✅ WebApp Ready!</p>}

        <button onClick={handleSendData}>Send Test Data to Backend</button>

        <div>
          <p>Count: {count}</p>
          <button onClick={incrementCount}>Increment Count</button>
        </div>

        {tg && (
          <>
            <p>Telegram WebApp Version: {tg.version}</p>
            <p>Platform: {tg.platform}</p>
            <p>User ID: {tg.initDataUnsafe?.user?.id || "Not available"}</p>
          </>
        )}

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
