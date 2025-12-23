import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";

// ReactDOM.render(<App />, document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );

root.render(<App />);

// registerServiceWorker();
