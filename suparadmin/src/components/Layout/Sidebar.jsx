// src/components/Layout/Sidebar.jsx
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Super Admin</h2>
      <nav className="space-y-1">
        {/* Dashboard */}
        <Link to="/dashboard" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-chart-line mr-2"></i>
            Dashboard
          </span>
        </Link>        
      
        {/* Company Management */}
        <Link to="/company-master" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-building mr-2"></i>
            Company Master
          </span>
        </Link>

        {/* Admin User Management */}
        <Link to="/admin-users" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-user-shield mr-2"></i>
            Admin User Master
          </span>
        </Link>

        {/* User Management */}
        <Link to="/users" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-users mr-2"></i>
            Location User Master
          </span>
        </Link>

        {/* Location Management */}
        <Link to="/locations" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-map-marker-alt mr-2"></i>
            Location 
          </span>
        </Link>

        {/* Device Management */}
        <Link to="/devices" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-laptop mr-2"></i>
            Device 
          </span>
        </Link>

        {/* Package Management */}
        <Link to="/packages" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-box mr-2"></i>
            Package 
          </span>
        </Link>

        {/* Batch Management */}
        <Link to="/batches" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-layer-group mr-2"></i>
            Batch Management
          </span>
        </Link>

        {/* Place Master */}
        <Link to="/places" className="block hover:bg-gray-700 px-3 py-2 rounded transition-colors">
          <span className="flex items-center">
            <i className="fas fa-map mr-2"></i>
            Place Master
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
