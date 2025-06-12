const Company = require("../models/companyModel");
const mongoose = require("mongoose");
const fs = require('fs').promises;
const path = require('path');

const ensureUploadDir = async () => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'company-logos');
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Get all companies
exports.getCompanies = async (req, res) => {
    const companies = await Company.find({}).lean();
    res.json(companies);
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await Company.findById(id).lean();
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
};

// Add a new company
exports.addCompany = async (req, res) => {
    await ensureUploadDir();

    const { name, email, code, contactNumber, address, password } = req.body;

    // Basic validation
    if (!name || !email || !code || !password || !contactNumber || !address) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ 
            message: "Missing required fields. Name, email, code, password, contact number and address are required." 
        });
    }

    // Validate contact number
    if (!/^[0-9]{10}$/.test(contactNumber)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ message: "Contact number must be a 10-digit number." });
    }

    // Check existing company
    const existingCompany = await Company.findOne({
        $or: [{ email }, { code }]
    }).lean();

    if (existingCompany) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({
            message: existingCompany.email === email 
                ? "Company with this email already exists"
                : "Company with this code already exists"
        });
    }

    const companyData = {
        name,
        email,
        password,
        code,
        contactNumber,
        address,
        isSuperAdmin: req.body.isSuperAdmin === "true",
        logo: req.file ? `/uploads/company-logos/${req.file.filename}` : null
    };

    const company = await Company.create(companyData);

    res.status(201).json({
        message: "Company created successfully",
        company: {
            _id: company._id,
            name: company.name,
            email: company.email,
            code: company.code,
            logo: company.logo,
            contactNumber: company.contactNumber,
            address: company.address,
            isSuperAdmin: company.isSuperAdmin
        }
    });
};

// Update company
exports.updateCompany = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await Company.findById(id);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    const { contactNumber, address } = req.body;
    
    if (contactNumber && !/^[0-9]{10}$/.test(contactNumber)) {
        return res.status(400).json({ message: "Contact number must be a 10-digit number." });
    }

    if (address && !address.trim()) {
        return res.status(400).json({ message: "If updating address, it cannot be empty." });
    }

    if (req.file) {
        if (company.logo) {
            const oldPath = path.join(__dirname, '..', company.logo);
            try {
                await fs.unlink(oldPath);
            } catch (err) {
                // Ignore error if file doesn't exist
            }
        }
        req.body.logo = `/uploads/company-logos/${req.file.filename}`;
    }

    if (!req.body.password) {
        delete req.body.password;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    ).lean();

    res.json({
        message: "Company updated successfully",
        company: updatedCompany
    });
};

// Delete company
exports.deleteCompany = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await Company.findById(id);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    if (company.logo) {
        const logoPath = path.join(__dirname, '..', company.logo);
        try {
            await fs.unlink(logoPath);
        } catch (err) {
            // Ignore error if file doesn't exist
        }
    }

    await Company.findByIdAndDelete(id);
    res.json({ message: "Company deleted successfully" });
};