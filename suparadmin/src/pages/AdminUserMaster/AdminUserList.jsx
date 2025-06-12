import { useState, useEffect, useCallback } from "react";
import axios from "../../utils/axiosConfig";
import Alert from "../../components/ui/Alert";
import AdminUserForm from "./AdminUserForm";
import ErrorBoundary from "../../components/ErrorBoundary";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    company: "",
    location: "",
    status: "all"
  });

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/admin-users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading admin users:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to load admin users"
      );
      showAlert(
        err.response?.data?.message || 
        err.message || 
        "Failed to load admin users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAdd = async (newUser) => {
    try {
      const res = await axios.post("/admin-users", newUser);
      setUsers([...users, res.data]);
      showAlert("Admin user added successfully");
      return true;
    } catch (err) {
      console.error("Error adding admin user:", err);
      showAlert(err.response?.data?.message || err.message, "error");
      throw err;
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const res = await axios.put(`/admin-users/${updatedUser._id}`, updatedUser);
      setUsers(users.map(user => 
        user._id === updatedUser._id ? res.data : user
      ));
      showAlert("Admin user updated successfully");
      return true;
    } catch (err) {
      console.error("Error updating admin user:", err);
      showAlert(err.response?.data?.message || err.message, "error");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin user?")) {
      try {
        await axios.delete(`/admin-users/${id}`);
        setUsers(users.filter(user => user._id !== id));
        showAlert("Admin user deleted successfully");
      } catch (err) {
        console.error("Error deleting admin user:", err);
        showAlert(err.response?.data?.message || err.message, "error");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    
    const matchesCompany = !filters.company || user.companyId === filters.company;
    const matchesLocation = !filters.location || user.locationId === filters.location;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);

    return matchesSearch && matchesCompany && matchesLocation && matchesStatus;
  });

  const uniqueCompanies = [...new Set(users.map(user => user.company?.name))].filter(Boolean);
  const uniqueLocations = [...new Set(users.map(user => user.location?.locationName))].filter(Boolean);

  return (
    <div className="p-6">
      {alert.show && (
        <Alert 
          message={alert.message} 
          type={alert.type}
          onClose={() => setAlert({ show: false })}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin User Management
        </h1>
        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add New Admin User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div>
          <select
            value={filters.company}
            onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No admin users found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company?.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.location?.locationName || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelected(user);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <AdminUserForm
          selectedUser={selected}
          onSuccess={() => {
            setShowForm(false);
            setSelected(null);
            loadUsers();
          }}
          onCancel={() => {
            setShowForm(false);
            setSelected(null);
          }}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

const AdminUserListWithBoundary = () => (
  <ErrorBoundary>
    <AdminUserList />
  </ErrorBoundary>
);

export default AdminUserListWithBoundary;
