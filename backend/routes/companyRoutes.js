const express = require("express");
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');


// Get all companies
router.get("/", getCompanies);

// Get a single company by ID
router.get("/:id", getCompanyById);

// Add a new company
router.post("/", addCompany);

// Update a company
router.put("/:id",  updateCompany);

// Delete a company
router.delete("/:id", deleteCompany);

// Export the router
module.exports = router;


