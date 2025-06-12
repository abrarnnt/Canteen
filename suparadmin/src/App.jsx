// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CompanyList from "./pages/CompanyMaster/CompanyList";
import UserList from "./pages/UserManagement/UserList";
import LocationList from "./pages/LocationManagement/LocationList";
import DeviceList from "./pages/DeviceManagement/DeviceList";
import PackageList from "./pages/PackageManagement/PackageList";
import BatchList from "./pages/BatchManagement/BatchList";
import PlaceList from "./pages/PlaceMaster/PlaceList";
import AdminUserList from "./pages/AdminUserMaster/AdminUserList";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </AdminLayout>
              </PrivateRoute>
            }
          />
        <Route
          path="/company-master"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <CompanyList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <UserList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/locations"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <LocationList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <DeviceList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/packages"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <PackageList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/batches"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <BatchList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/places"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <PlaceList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ErrorBoundary>
                  <AdminUserList />
                </ErrorBoundary>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
