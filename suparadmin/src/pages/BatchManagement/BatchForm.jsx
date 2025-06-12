import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../../utils/axiosConfig";

const BatchForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    batch_name: "",
    year: new Date().getFullYear(),
    place_id: "",
    location_id: "",
    description: ""
  });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState({
    places: false,
    locations: false,
    submit: false
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlaces();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        batch_name: initialData.batch_name || "",
        year: initialData.year || new Date().getFullYear(),
        place_id: initialData.place_id?._id || initialData.place_id || "",
        location_id: initialData.location_id?._id || initialData.location_id || "",
        description: initialData.description || ""
      });
      
      if (initialData.place_id) {
        loadLocationsForPlace(initialData.place_id._id || initialData.place_id);
      }
    }
  }, [initialData]);

  const loadPlaces = async () => {
    setLoading(prev => ({ ...prev, places: true }));
    setError("");
    try {
      const res = await axios.get('/places');
      if (!Array.isArray(res.data)) {
        throw new Error('Invalid response format');
      }
      setPlaces(res.data);
    } catch (error) {
      console.error('Error loading places:', error);
      setError(error.response?.data?.message || "Failed to load places. Please try refreshing the page.");
      setPlaces([]);
    } finally {
      setLoading(prev => ({ ...prev, places: false }));
    }
  };  

  const loadLocationsForPlace = async (placeId) => {
    if (!placeId) return;
    setLoading(prev => ({ ...prev, locations: true }));
    setError("");
    try {
      const res = await axios.get(`/locations?placeId=${placeId}`);
      if (!Array.isArray(res.data)) {
        throw new Error('Invalid response format');
      }
      setLocations(res.data);
    } catch (error) {
      console.error('Error loading locations:', error);
      setError(error.response?.data?.message || "Failed to load locations. Please try again.");
      setLocations([]);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!formData.batch_name?.trim()) {
      setError("Batch name is required");
      return;
    }
    if (!formData.place_id) {
      setError("Please select a place");
      return;
    }
    if (!formData.location_id) {
      setError("Please select a location");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save batch");
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {initialData ? 'Edit Batch' : 'Add New Batch'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 mb-4">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="2000"
                  max="2100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 mb-4">Location Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place
                </label>
                <select
                  name="place_id"
                  value={formData.place_id}
                  onChange={(e) => {
                    const placeId = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      place_id: placeId,
                      location_id: "" // Reset location when place changes
                    }));
                    if (placeId) loadLocationsForPlace(placeId);
                  }}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                    loading.places ? 'bg-gray-100' : ''
                  }`}
                  required
                  disabled={loading.places}
                >
                  <option value="">Select Place</option>
                  {places.map(place => (
                    <option key={place._id} value={place._id}>{place.name}</option>
                  ))}
                </select>
                {loading.places && (
                  <div className="mt-2 text-sm text-gray-500">Loading places...</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_id: e.target.value }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                    loading.locations || !formData.place_id ? 'bg-gray-100' : ''
                  }`}
                  required
                  disabled={loading.locations || !formData.place_id}
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location._id} value={location._id}>{location.locationName}</option>
                  ))}
                </select>
                {loading.locations && (
                  <div className="mt-2 text-sm text-gray-500">Loading locations...</div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 mb-4">Additional Details</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
              disabled={loading.submit}
            >
              {loading.submit ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : initialData ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BatchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default BatchForm;
