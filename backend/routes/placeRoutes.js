const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');


// Get all places
router.get('/', placeController.getAllPlaces);

// Get place by ID
router.get('/:id', placeController.getPlaceById);

// Create new place
router.post('/', placeController.createPlace);

// Update place
router.put('/:id', placeController.updatePlace);

// Delete place
router.delete('/:id', placeController.deletePlace);

module.exports = router;
