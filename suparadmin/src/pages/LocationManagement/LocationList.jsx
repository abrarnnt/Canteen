import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axiosConfig';
import Alert from '../../components/ui/Alert';
import LocationForm from './LocationForm';

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const loadLocations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
      showAlert('Failed to load locations', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleAdd = async (locationData) => {
    setLoading(true);
    try {
      await axios.post('/locations', locationData);
      await loadLocations();
      setShowForm(false);
      showAlert('Location added successfully');
    } catch (error) {
      console.error('Error adding location:', error);
      showAlert(error.response?.data?.message || 'Failed to add location', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (locationData) => {
    setLoading(true);
    try {
      await axios.put(`/locations/${selectedLocation._id}`, locationData);
      await loadLocations();
      setShowForm(false);
      setSelectedLocation(null);
      showAlert('Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
      showAlert(error.response?.data?.message || 'Failed to update location', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLoading(true);
      try {
        await axios.delete(`/locations/${id}`);
        await loadLocations();
        showAlert('Location deleted successfully');
      } catch (error) {
        console.error('Error deleting location:', error);
        showAlert(error.response?.data?.message || 'Failed to delete location', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredLocations = locations.filter(location => 
    location.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.placeId?.placeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false })} />}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Location Management</h1>
        <button
          onClick={() => {
            setSelectedLocation(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          ADD LOCATION
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Location Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Place
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLocations.map((location) => (
              <tr key={location._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 rounded bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {location.locationName?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {location.locationName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {location.placeId?.placeName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(location.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {location.createdBy || 'System'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => {/* View logic */}}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLocation(location);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(location._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredLocations.length}</span> of{" "}
                <span className="font-medium">{filteredLocations.length}</span> results
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-700 mr-4">Rows per page: 10</span>
              <span className="text-sm text-gray-700">1-6 of 6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Form Modal */}
      {showForm && (
        <LocationForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          selectedLocation={selectedLocation}
          onCancel={() => {
            setShowForm(false);
            setSelectedLocation(null);
          }}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default LocationList;
