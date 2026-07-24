import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Goals from "../pages/Goals/Goals";
import Tasks from "../pages/Tasks/Tasks";
import Focus from "../pages/Focus/Focus";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";
import Login from "../pages/Login/Login";



export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route element={<AppLayout />}>

                    <Route path="/" element={<Dashboard />} />

                    <Route path="/goals" element={<Goals />} />

                    <Route path="/tasks" element={<Tasks />} />

                    <Route path="/focus" element={<Focus />} />

                    <Route path="/analytics" element={<Analytics />} />

                    <Route path="/settings" element={<Settings />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}