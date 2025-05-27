import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FluentProvider theme={webLightTheme}>
          <App />
        </FluentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
