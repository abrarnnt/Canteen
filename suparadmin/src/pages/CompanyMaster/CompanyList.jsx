import { useState, useEffect, useCallback } from "react";
import axios from "../../utils/axiosConfig";
import Alert from "../../components/ui/Alert";
import CompanyForm from "./CompanyForm";
import ErrorBoundary from "../../components/ErrorBoundary";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  }, []);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {      const res = await axios.get("/company");
      setCompanies(Array.isArray(res.data) ? res.data : []);
      setError(null);
      setRetryCount(0); // Reset retry count on successful load
    } catch (error) {
      console.error("Error loading companies:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        retryCount: error.config?.retryCount,
      });

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load companies. Please try again."
      );
      setCompanies([]);
      showAlert(
        error.response?.data?.message ||
          error.message ||
          "Failed to load companies. Please try again.",
        "error"
      );
      setRetryCount(error.config?.retryCount || 0);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleAdd = async (newCompany) => {
    try {      const res = await axios.post("/company", newCompany);
      setCompanies([...companies, res.data.company]);
      setShowForm(false);
      showAlert("Company added successfully");
    } catch (error) {
      console.error("Error adding company:", error);
      showAlert(
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };
  const handleUpdate = async (updatedCompany) => {
    try {
      console.log("Updating company:", updatedCompany);
      setLoading(true);      const res = await axios.put(
        `/company/${updatedCompany._id}`,
        updatedCompany
      );

      console.log("Update response:", res.data);

      setCompanies((prevCompanies) =>
        prevCompanies.map((c) => (c._id === updatedCompany._id ? res.data : c))
      );

      setShowForm(false);
      setSelected(null);
      showAlert("Company updated successfully");
    } catch (error) {
      console.error("Error updating company:", error.response?.data || error);
      showAlert(
        error.response?.data?.message ||
          error.message ||
          "Error updating company. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {        await axios.delete(`/company/${id}`);
        setCompanies(companies.filter((c) => c._id !== id));
        showAlert("Company deleted successfully");
      } catch (error) {
        console.error("Error deleting company:", error);
        showAlert(
          error.response?.data?.message || error.message,
          "error"
        );
      }
    }
  };
  return (
    <div className="p-6">
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Company Management
        </h1>
        {loading && !error && (
          <div className="flex items-center text-blue-600">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading companies...
          </div>
        )}
        {error && (
          <div className="text-red-500 bg-red-50 p-3 rounded-md flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
            {retryCount > 0 && (
              <span className="ml-2 text-sm text-red-400">
                (Retry attempt: {retryCount}/3)
              </span>
            )}
            <button
              onClick={loadCompanies}
              className="ml-3 text-sm bg-red-100 px-2 py-1 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}
        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add New Company
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading companies...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading companies
              </h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={loadCompanies}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No companies found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            company.logo ||
                            "https://via.placeholder.com/100"
                          }
                          alt={company.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {company.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {company.code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {company.contactNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {company.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          company.isSuperAdmin
                            ? "bg-green-500"
                            : "bg-gray-300"
                        } mr-2`}
                      ></div>
                      {company.isSuperAdmin ? "Super Admin" : "Regular"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelected(company);
                        setShowForm(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CompanyForm
          selectedCompany={selected}
          onSuccess={() => {
            setShowForm(false);
            setSelected(null);
            loadCompanies();
          }}
          onCancel={() => {
            setShowForm(false);
            setSelected(null);
          }}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};

const CompanyListWithBoundary = () => (
  <ErrorBoundary>
    <CompanyList />
  </ErrorBoundary>
);

export default CompanyListWithBoundary;
