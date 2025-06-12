import { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";

const PackageForm = ({ selectedPackage, onSuccess, onCancel }) => {  const [formData, setFormData] = useState({
    name: "",
    place_id: "",
    location_id: "",
    price: "",
    is_fixed_validity: false,
    validity_days: "",
    validity_date: "",
    timeline_id: "1", 
    timezone_id: "UTC" 
  });

  const [places, setPlaces] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlaces();
    if (selectedPackage) {      setFormData({
        name: selectedPackage.name ?? "",
        place_id: selectedPackage.place_id?._id ?? "",
        location_id: selectedPackage.location_id?._id ?? "",
        price: selectedPackage.price ?? "",
        is_fixed_validity: selectedPackage.is_fixed_validity ?? false,
        validity_days: selectedPackage.validity_days ?? "",
        validity_date: selectedPackage.validity_date ? selectedPackage.validity_date.split('T')[0] : "",
        timeline_id: selectedPackage.timeline_id ?? "1",
        timezone_id: selectedPackage.timezone_id ?? "UTC"
      });
      if (selectedPackage.place_id?._id) {
        loadLocationsForPlace(selectedPackage.place_id._id);
      }
    }
  }, [selectedPackage]);

  const loadPlaces = async () => {
    try {
      const response = await axios.get("/place");
      setPlaces(response.data);
    } catch (err) {
      setError("Failed to load places");
      console.error("Error loading places:", err);
    }
  };

  const loadLocationsForPlace = async (placeId) => {
    try {
      const response = await axios.get(`/location/by-place/${placeId}`);
      setLocations(response.data);
    } catch (err) {
      setError("Failed to load locations");
      console.error("Error loading locations:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'place_id' ? { location_id: "" } : {})
    }));

    if (name === 'place_id' && value) {
      loadLocationsForPlace(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name?.trim()) {
      setError("Package name is required");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        validity_days: parseInt(formData.validity_days)
      };

      if (selectedPackage) {
        await axios.put(`/package/${selectedPackage._id}`, submitData);
      } else {
        await axios.post("/package", submitData);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedPackage ? 'Edit Package' : 'Add New Package'}
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Place</label>
              <select
                name="place_id"
                value={formData.place_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Place</option>
                {places.map(place => (
                  <option key={place._id} value={place._id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <select
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={!formData.place_id}
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Validity Days</label>
              <input
                type="number"
                name="validity_days"
                value={formData.validity_days}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Validity Date</label>
              <input
                type="date"
                name="validity_date"
                value={formData.validity_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_fixed_validity"
                  checked={formData.is_fixed_validity}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Fixed Validity</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Saving..." : selectedPackage ? "Update Package" : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageForm;
