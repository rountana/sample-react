import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import WebApp from "@twa-dev/sdk";
import { decycle, retrocycle } from "json-decycle";

// Define your backend API endpoint
const BACKEND_API_ENDPOINT = "http://localhost:5000"; // Replace with your actual backend URL if different

function App() {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [themeParams, setThemeParams] = useState(null);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);

    // For keyboard button Mini Apps: Send count updates to bot
    // sendCountUpdate(newCount);
  };

  function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  }

  // useEffect(() => {
  //   if (count > 0) {
  //     // Avoid sending initial 0 count
  //     fetch("/api/webapp-data", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ count }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => console.log("Backend response:", data))
  //       .catch((error) => {
  //         console.error("Error sending count to backend:", error);
  //       });
  //   }
  // }, [count]);

  useEffect(() => {
    // Check if we're in Telegram Web App environment
    console.log("useEffect: Starting environment check.");
    console.log("useEffect: typeof window:", typeof window);

    let isTelegramEnvironment = false;
    if (typeof window !== "undefined") {
      console.log("useEffect: window.Telegram:", window.Telegram);
      console.log("useEffect: window.Telegram.WebApp:", window.Telegram.WebApp);

      if (window.Telegram && window.Telegram.WebApp) {
        // Add new logs here
        console.log(
          "useEffect: window.Telegram.WebApp.initData:",
          window.Telegram.WebApp.initData
        );
        console.log(
          "useEffect: window.Telegram.WebApp.initDataUnsafe:",
          window.Telegram.WebApp.initDataUnsafe
        );
        if (window.Telegram.WebApp.initDataUnsafe) {
          console.log(
            "useEffect: window.Telegram.WebApp.initDataUnsafe.query_id:",
            window.Telegram.WebApp.initDataUnsafe.query_id
          );
        } else {
          console.log(
            "useEffect: window.Telegram.WebApp.initDataUnsafe is undefined/null"
          );
        }
        // Original logic for setting isTelegramEnvironment (we will refine this later)
        isTelegramEnvironment = true;
      }
    }
    console.log("useEffect: isTelegramEnvironment:", isTelegramEnvironment);

    if (isTelegramEnvironment) {
      console.log(
        "useEffect: Detected Telegram WebApp environment. Initializing..."
      );
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
        tg.MainButton.text = "Test sending data";
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
      console.log("useEffect: Did NOT detect Telegram WebApp environment.");
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

  // called when the main button is clicked (available in telegram only)
  const handleSendData = () => {
    console.log("handleSendData called");
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
        event: "main_button_click", // Changed event name for clarity
        init_data: tg.initData,
        version: tg.version,
        platform: tg.platform,
      };

      // if (count > 0) {
      try {
        console.log("Attempting to send data via fetch to backend:", testData);
        fetch(`${BACKEND_API_ENDPOINT}/api/webapp-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Data sent successfully to backend:", data);
            tg.showAlert(data.message || "Data sent to server!");
          })
          .catch((err) => {
            console.error("Error sending data to backend:", err);
            setError(`Send error: ${err.message}`);
            tg.showAlert(`Error: ${err.message}`);
          });
      } catch (err) {
        console.error("Error preparing data for backend:", err);
        setError(`Client-side send error: ${err.message}`);
        tg.showAlert(`Client-side error: ${err.message}`);
      }
    } else {
      console.error("Telegram WebApp not available");
      setError("Telegram WebApp not available");
    }
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
        init_data: tg.initData, // Crucial for backend validation and query_id
        version: tg.version,
        platform: tg.platform,
      };

      try {
        console.log("Sending count update via fetch to backend:", countData);
        fetch(`${BACKEND_API_ENDPOINT}/api/webapp-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(countData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Count update sent successfully to backend:", data);
            // Optionally, provide feedback to the user, though it might be too frequent for count updates
            // tg.showAlert(data.message || "Count updated on server!");
          })
          .catch((err) => {
            console.error("Error sending count update to backend:", err);
            // setError might be too intrusive for every count update error
          });
      } catch (err) {
        console.error("Error preparing count update for backend:", err);
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
        count: count, // Send current count state
        init_data: tg.initData,
        version: tg.version,
        platform: tg.platform,
      };

      try {
        console.log("Sending app loaded event via fetch to backend:", loadData);
        fetch(`${BACKEND_API_ENDPOINT}/api/webapp-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loadData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("App loaded event sent successfully to backend:", data);
            tg.showAlert(data.message || "App loaded event sent to server!");
          })
          .catch((err) => {
            console.error("Error sending app loaded event to backend:", err);
            setError(`App load event error: ${err.message}`);
            tg.showAlert(`Error sending app load event: ${err.message}`);
          });
      } catch (err) {
        console.error("Error preparing app loaded event for backend:", err);
        setError(`Client-side app load error: ${err.message}`);
        tg.showAlert(`Client-side error: ${err.message}`);
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
            Increment Count
          </button>

          {/* <button
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
          </button> */}
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
