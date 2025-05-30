import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import WebApp from "@twa-dev/sdk";

function App() {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [themeParams, setThemeParams] = useState(null);

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

        // Set up theme
        setThemeParams(tg.themeParams);

        // Expand the app to full height
        tg.expand();

        // Enable closing confirmation
        tg.enableClosingConfirmation();

        // Set up main button for keyboard button Mini Apps
        tg.MainButton.text = "Send Data to Bot";
        tg.MainButton.show();
        tg.MainButton.onClick(() => handleSendData());

        setIsReady(true);

        // For KEYBOARD BUTTON Mini Apps: Don't auto-send data on load
        // Let the user explicitly trigger data sending via buttons
        console.log(
          "Mini App loaded and ready for keyboard button interaction"
        );
      } catch (err) {
        setError(`WebApp initialization error: ${err.message}`);
        console.error("WebApp error:", err);
      }
    } else {
      setError("Not running in Telegram WebApp environment");
      console.warn("Telegram WebApp not available");
    }

    // Cleanup function
    return () => {
      if (window.Telegram?.WebApp?.MainButton) {
        window.Telegram.WebApp.MainButton.offClick(handleSendData);
        window.Telegram.WebApp.MainButton.hide();
      }
    };
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
        event: "button_click",
        // Send initData for proper server-side validation
        init_data: tg.initData,
        version: tg.version,
        platform: tg.platform,
      };

      try {
        const dataStr = JSON.stringify(testData);
        console.log("Attempting to send data via sendData():", dataStr);

        // Use sendData() for KEYBOARD BUTTON Mini Apps
        tg.sendData(dataStr);

        // Show notification
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

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);

    // For keyboard button Mini Apps: Send count updates to bot
    sendCountUpdate(newCount);
  };

  const sendCountUpdate = (newCount) => {
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const tg = window.Telegram.WebApp;
      const countData = {
        event: "count_update",
        count: newCount,
        timestamp: new Date().toISOString(),
        init_data: tg.initData,
        version: tg.version,
        platform: tg.platform,
      };

      try {
        const dataStr = JSON.stringify(countData);
        console.log("Sending count update via sendData():", dataStr);
        tg.sendData(dataStr);
      } catch (err) {
        console.error("Error sending count update:", err);
      }
    }
  };

  const sendAppLoadedEvent = () => {
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const tg = window.Telegram.WebApp;
      const loadData = {
        event: "app_loaded",
        timestamp: new Date().toISOString(),
        count: count,
        init_data: tg.initData,
        version: tg.version,
        platform: tg.platform,
      };

      try {
        const dataStr = JSON.stringify(loadData);
        console.log("Sending app loaded event via sendData():", dataStr);
        tg.sendData(dataStr);
        tg.showAlert("App loaded event sent to bot!");
      } catch (err) {
        console.error("Error sending app loaded event:", err);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const tg =
    typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp
      ? window.Telegram.WebApp
      : null;

  // Apply theme-aware styling
  const appStyle = {
    backgroundColor: themeParams?.bg_color || "#ffffff",
    color: themeParams?.text_color || "#000000",
    minHeight: "100vh",
    padding: "20px",
  };

  return (
    <div className="App" style={appStyle}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World! This is a Telegram Mini App.</p>

        {error && (
          <p style={{ color: themeParams?.destructive_text_color || "red" }}>
            Error: {error}
          </p>
        )}
        {!isReady && !error && <p>Initializing Telegram WebApp...</p>}
        {isReady && (
          <p style={{ color: themeParams?.link_color || "green" }}>
            ✅ WebApp Ready!
          </p>
        )}

        <div>
          <p>Count: {count}</p>
          <button
            onClick={incrementCount}
            style={{
              backgroundColor: themeParams?.secondary_bg_color || "#f0f0f0",
              color: themeParams?.text_color || "#000000",
              border: `1px solid ${themeParams?.hint_color || "#ccc"}`,
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              margin: "5px",
            }}
          >
            Increment Count (Sends Data)
          </button>

          <button
            onClick={sendAppLoadedEvent}
            style={{
              backgroundColor: themeParams?.button_color || "#0088cc",
              color: themeParams?.button_text_color || "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              margin: "5px",
            }}
          >
            Send App Loaded Event
          </button>
        </div>

        {/* Keyboard Button Mini App Instructions */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: themeParams?.section_bg_color || "#e8f4fd",
            borderRadius: "8px",
            border: `1px solid ${themeParams?.hint_color || "#ccc"}`,
          }}
        >
          <h4
            style={{
              margin: "0 0 10px 0",
              color: themeParams?.accent_text_color || "#0088cc",
            }}
          >
            🎯 Keyboard Button Mini App
          </h4>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            • All buttons send data using <code>sendData()</code>
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            • Count updates are sent automatically to bot
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            • Use the blue button at bottom to send manual data
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            • Check your bot logs to see data reception
          </p>
        </div>

        {tg && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: themeParams?.secondary_bg_color || "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>WebApp Info:</h3>
            <p>Telegram WebApp Version: {tg.version}</p>
            <p>Platform: {tg.platform}</p>
            {/* Remove displaying user ID from initDataUnsafe - this should be validated server-side */}
            <p>Init Data Available: {tg.initData ? "Yes" : "No"}</p>
            <p>Theme: {tg.colorScheme}</p>
          </div>
        )}

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: themeParams?.link_color || "#0088cc" }}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
