// import React from "react";
// import ReactDOM from "react-dom/client";

// import "./index.css";

// import AppRoutes from "./routes/AppRouter";

// ReactDOM.createRoot(document.getElementById("root")).render(
//     <React.StrictMode>
//         <AppRoutes />
//     </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

function Test() {
  return (
    <div style={{ padding: 40 }}>
      <h1>FocusFlow Test</h1>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>
);