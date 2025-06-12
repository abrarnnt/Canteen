import { useState, useEffect } from "react";
import axios from '../../utils/axiosConfig';

const UserForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "user",
    uniqueId: "",
    dateOfBirth: "",
    address: "",
    state: "",
    city: "",
    mobileNo: "",
    department: "",
    designation: "",
    placeId: "",
    locationId: "",
    roleId: ""
  });

  const [places, setPlaces] = useState([]);
  const [locations, setLocations] = useState([]);


  useEffect(() => {
    fetchPlaces();
    
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.placeId) {
        fetchLocations(initialData.placeId);
      }
    }
  }, [initialData]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get('/places');
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchLocations = async (placeId) => {
    try {
      const response = await axios.get(`/places/${placeId}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'placeId') {
      fetchLocations(value);
      setFormData(prev => ({
        ...prev,
        locationId: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Edit User' : 'Add New User'}
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-3">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="Employee ID/Roll No"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          

          {/* Location Information */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-3">Location Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="placeId"
                value={formData.placeId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Place</option>
                {places.map(place => (
                  <option key={place._id} value={place._id}>{place.placeName}</option>
                ))}
              </select>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                disabled={!formData.placeId}
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location._id} value={location._id}>{location.locationName}</option>
                ))}
              </select>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-2 border rounded-md col-span-2"
                required
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              {initialData ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
