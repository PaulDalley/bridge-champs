import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App";
import MyErrorBoundary from "./helpers/ErrorBoundary";
// import registerServiceWorker from "./registerServiceWorker";

// ReactDOM.render(<App />, document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );

root.render(
  <HelmetProvider>
    <MyErrorBoundary>
      <App />
    </MyErrorBoundary>
  </HelmetProvider>
);

// registerServiceWorker();
