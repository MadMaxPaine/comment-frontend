import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./stores/Context";
import { ThemeProvider } from "./styles/theme-context";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);
