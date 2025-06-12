const express = require("express");
const router = express.Router();
const {
    getAllBatches,
    createBatch,
    updateBatch,
    deleteBatch
} = require("../controllers/batchController");

// Get all batches
router.get("/", getAllBatches);

// Create new batch
router.post("/", createBatch);

// Update batch
router.put("/:id", updateBatch);

// Delete batch
router.delete("/:id", deleteBatch);

module.exports = router;
