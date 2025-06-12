import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";

const CompanyForm = ({ selectedCompany, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    code: "",
    logo: null,
    contactNumber: "",
    address: "",
    isSuperAdmin: false
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (selectedCompany) {      setFormData({
        name: selectedCompany.name || "",
        email: selectedCompany.email || "",
        code: selectedCompany.code || "",
        contactNumber: selectedCompany.contactNumber || "",
        address: selectedCompany.address || "",
        isSuperAdmin: selectedCompany.isSuperAdmin || false,
      });
      setPreviewUrl(selectedCompany.logo || "");
    }
  }, [selectedCompany]);

  // Cleanup preview URL when component unmounts or when it changes
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
          setApiError("Please select only PNG or JPG images");
          return;
        }
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setApiError("File size must be less than 5MB");
          return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFormData(prev => ({
          ...prev,
          logo: file
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      // Basic validation
      if (!formData.name.trim()) return setApiError("Company name is required");
      if (!formData.code.trim()) return setApiError("Company code is required");
      if (!formData.email.trim()) return setApiError("Email is required");
      if (!formData.contactNumber.trim()) return setApiError("Contact number is required");
      if (!formData.address.trim()) return setApiError("Address is required");
      if (!selectedCompany && !formData.password) return setApiError("Password is required for new companies");

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return setApiError("Please enter a valid email address");
      }

      // Validate contact number (10 digits)
      if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
        return setApiError("Contact number must be 10 digits");
      }

      // Create FormData for submission
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("code", formData.code.trim());
      submitData.append("contactNumber", formData.contactNumber.trim());
      submitData.append("address", formData.address.trim());
      submitData.append("isSuperAdmin", formData.isSuperAdmin ? "true" : "false");
      
      if (formData.logo instanceof File) {
        submitData.append("logo", formData.logo);
      }
      
      if (!selectedCompany && formData.password) {
        submitData.append("password", formData.password);
      }

      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000, // Increase timeout to 60 seconds for file uploads
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      };

      if (selectedCompany) {
        await axios.put(`/company/${selectedCompany._id}`, submitData, config);
      } else {
        await axios.post("/company", submitData, config);
      }

      onSuccess();
    } catch (err) {
      console.error("Error:", err);
      if (err.code === 'ECONNABORTED') {
        setApiError("The upload took too long. Please try again or use a smaller file.");
      } else {
        setApiError(err.response?.data?.message || "An error occurred while saving the company");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCompany ? 'Edit Company' : 'Add New Company'}
          </h3>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ×
          </button>
        </div>{apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 mb-3">Company Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Company Code"
                className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Company Email"
                className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
              {!selectedCompany && (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 mb-3">Contact Information</h4>
            <div className="space-y-4">
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address"
                rows="3"
                className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 mb-3">Company Logo</h4>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="w-24 h-24 border rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Company logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  accept=".png,.jpg,.jpeg"
                  className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Accepted formats: PNG, JPG. Max file size: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isSuperAdmin"
                checked={formData.isSuperAdmin}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">Super Admin Access</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                selectedCompany ? 'Update Company' : 'Create Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
