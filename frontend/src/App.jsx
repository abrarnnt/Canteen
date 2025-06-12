// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["superadmin", "admin", "user"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<div> Unauthorized</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
