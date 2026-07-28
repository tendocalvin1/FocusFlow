import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

import AppRoutes from "./routes/AppRouter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
             <AppRoutes />
        </AuthProvider>
    </React.StrictMode>
);