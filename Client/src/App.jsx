import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/home/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./notification/NotificationPage.jsx"
import ProfilePage from "./pages/profile/ProfilePage.jsx";

function App() {
  const [authUser, setAuthUser] = useState(true); 

  return (
    <div className="flex max-w-7xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={authUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Protected Routes (Require authentication) */}
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  );
}

export default App;
