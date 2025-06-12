import { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";

const LocationForm = ({ onAdd, onUpdate, selectedLocation, onCancel }) => {
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    place: "",
    locationName: "",
    description: "",
    meals: {
      breakfast: { enabled: false, startTime: "07:00", endTime: "09:00" },
      lunch: { enabled: false, startTime: "12:00", endTime: "14:00" },
      supper: { enabled: false, startTime: "16:00", endTime: "17:00" },
      dinner: { enabled: false, startTime: "19:00", endTime: "21:00" },
      lateSnacks: { enabled: false, startTime: "22:00", endTime: "23:00" },
    },
  });
  const [errors, setErrors] = useState({});

  // Time validation function
  const isValidTime = (timeStr) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeStr);
  };

  // Convert time string to minutes for comparison
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Check if end time is after start time
  const isValidTimeRange = (startTime, endTime) => {
    if (!isValidTime(startTime) || !isValidTime(endTime)) return false;
    return timeToMinutes(endTime) > timeToMinutes(startTime);
  };

  // Check for meal time overlaps
  const checkMealOverlaps = () => {
    const meals = ["breakfast", "lunch", "supper", "dinner", "lateSnacks"];
    let lastEndTime = "00:00";
    const newErrors = {};

    for (const meal of meals) {
      if (formData.meals[meal].enabled) {
        const { startTime, endTime } = formData.meals[meal];

        if (!isValidTime(startTime)) {
          newErrors[`${meal}Start`] = "Invalid time format";
          continue;
        }
        if (!isValidTime(endTime)) {
          newErrors[`${meal}End`] = "Invalid time format";
          continue;
        }
        if (!isValidTimeRange(startTime, endTime)) {
          newErrors[`${meal}Range`] = "End time must be after start time";
          continue;
        }

        if (timeToMinutes(startTime) < timeToMinutes(lastEndTime)) {
          newErrors[`${meal}Overlap`] = `${meal} must start after previous meal ends`;
        }
        lastEndTime = endTime;
      }
    }
    return newErrors;
  };

  useEffect(() => {
    // Fetch places when component mounts
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("/places");
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setFormData({
        ...selectedLocation,
        place: selectedLocation.placeId,
      });
    }
  }, [selectedLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMealToggle = (mealType) => {
    setFormData((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: {
          ...prev.meals[mealType],
          enabled: !prev.meals[mealType].enabled,
        },
      },
    }));
  };

  const handleTimeChange = (mealType, timeType, value) => {
    if (value && !isValidTime(value)) return; // Early validation

    setFormData((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: {
          ...prev.meals[mealType],
          [timeType]: value,
        },
      },
    }));

    // Clear related errors when input changes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${mealType}${timeType === "startTime" ? "Start" : "End"}`];
      delete newErrors[`${mealType}Range`];
      delete newErrors[`${mealType}Overlap`];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate time ranges and overlaps
    const timeErrors = checkMealOverlaps();
    if (Object.keys(timeErrors).length > 0) {
      setErrors(timeErrors);
      return;
    }

    try {
      const submitData = {
        placeId: formData.place,
        locationName: formData.locationName,
        description: formData.description,
        meals: formData.meals,
      };

      if (selectedLocation) {
        await onUpdate(submitData);
      } else {
        await onAdd(submitData);
      }
    } catch (error) {
      console.error("Error saving location:", error);
      setErrors({ submit: error.response?.data?.message || "Failed to save location" });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Location Details</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Place</option>
              {places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.placeName}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Location name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded-md"
            rows="3"
          />

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-4">Package Meals Details</h4>
            {errors.submit && (
              <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">
                {errors.submit}
              </div>
            )}

            {Object.entries(formData.meals).map(([meal, details]) => (
              <div key={meal} className="flex flex-col space-y-2 mb-6 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={details.enabled}
                      onChange={() => handleMealToggle(meal)}
                      className="rounded border-gray-300 text-purple-600"
                    />
                    <span className="capitalize">{meal}</span>
                  </label>
                </div>

                {details.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={details.startTime}
                        onChange={(e) => handleTimeChange(meal, "startTime", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                      {errors[`${meal}Start`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`${meal}Start`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={details.endTime}
                        onChange={(e) => handleTimeChange(meal, "endTime", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                      {errors[`${meal}End`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`${meal}End`]}</p>
                      )}
                    </div>
                    {(errors[`${meal}Range`] || errors[`${meal}Overlap`]) && (
                      <p className="text-red-500 text-sm col-span-2">
                        {errors[`${meal}Range`] || errors[`${meal}Overlap`]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;
