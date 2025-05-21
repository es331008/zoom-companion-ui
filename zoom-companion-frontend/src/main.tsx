import {createRoot} from "react-dom/client";
import "./index.css";
import {BrowserRouter} from "react-router";
import {CssBaseline} from "@mui/material";
import App from "./App.tsx";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById("root")!).render(
    // Strict mode is causing issues with the way the zoom client renders itself
  // <StrictMode>
      <BrowserRouter>
          <CssBaseline />
          <App />
      </BrowserRouter>
  // </StrictMode>
);
