const Location = require("../models/locationModel");
const Place = require("../models/placeModel");

// Get all locations
exports.getAllLocations = async (req, res) => {
  const { placeId } = req.query;
  const query = placeId ? { placeId } : {};
    
  const locations = await Location.find(query)
    .populate("placeId", "placeName")
    .lean();
  
  res.json(locations);
};

// Create a location
exports.createLocation = async (req, res) => {
  const location = await Location.create(req.body);

  await Place.findByIdAndUpdate(req.body.placeId, {
    $push: { locations: location._id },
  });

  const populatedLocation = await Location.findById(location._id)
    .populate("placeId", "placeName")
    .lean();

  res.status(201).json(populatedLocation);
};

// Get location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate(
      "placeId",
      "placeName"
    );
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a location
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // If placeId is being changed, update the places' locations arrays
    if (
      req.body.placeId &&
      req.body.placeId !== location.placeId.toString()
    ) {
      // Remove location from old place
      await Place.findByIdAndUpdate(location.placeId, {
        $pull: { locations: location._id },
      });

      // Add location to new place
      await Place.findByIdAndUpdate(req.body.placeId, {
        $push: { locations: location._id },
      });
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("placeId", "placeName");

    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Remove location from place's locations array
    await Place.findByIdAndUpdate(location.placeId, {
      $pull: { locations: location._id },
    });

    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
