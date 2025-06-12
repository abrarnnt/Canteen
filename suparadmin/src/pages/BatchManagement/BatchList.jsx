import React, { useState, useEffect, useCallback } from "react";
import axios from "../../utils/axiosConfig";
import Alert from "../../components/ui/Alert";
import BatchForm from "./BatchForm";

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'batch_name', direction: 'asc' });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const loadBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/batches");
      setBatches(res.data);
    } catch (err) {
      console.error("Error loading batches:", err);
      showAlert(err.response?.data?.message || "Failed to load batches", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const handleAdd = async (data) => {
    setLoading(true);
    try {
      await axios.post("/batches", data);
      await loadBatches();
      setShowForm(false);
      showAlert("Batch created successfully");
    } catch (err) {
      console.error("Error adding batch:", err);
      showAlert(err.response?.data?.message || "Failed to create batch", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await axios.put(`/batches/${selectedBatch._id}`, data);
      await loadBatches();
      setShowForm(false);
      setSelectedBatch(null);
      showAlert("Batch updated successfully");
    } catch (err) {
      console.error("Error updating batch:", err);
      showAlert(err.response?.data?.message || "Failed to update batch", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      setLoading(true);
      try {
        await axios.delete(`/batches/${id}`);
        await loadBatches();
        showAlert("Batch deleted successfully");
      } catch (err) {
        console.error("Error deleting batch:", err);
        showAlert(err.response?.data?.message || "Failed to delete batch", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortedBatches = () => {
    const sorted = [...batches].sort((a, b) => {
      const aVal = a[sortConfig.key]?.name || a[sortConfig.key];
      const bVal = b[sortConfig.key]?.name || b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const handleToggleStatus = async (batch) => {
    const newStatus = batch.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`/batches/${batch._id}`, { ...batch, status: newStatus });
      await loadBatches();
      showAlert(`Batch status updated to ${newStatus}`);
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6">
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false })}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add New Batch
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('batch_name')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Batch Name {renderSortIndicator('batch_name')}
                  </th>
                  <th
                    onClick={() => handleSort('year')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Year {renderSortIndicator('year')}
                  </th>
                  <th
                    onClick={() => handleSort('description')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Description {renderSortIndicator('description')}
                  </th>
                  <th
                    onClick={() => handleSort('place_id')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Place {renderSortIndicator('place_id')}
                  </th>
                  <th
                    onClick={() => handleSort('location_id')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Location {renderSortIndicator('location_id')}
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Status {renderSortIndicator('status')}
                  </th>
                  <th
                    onClick={() => handleSort('created_at')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  >
                    Created {renderSortIndicator('created_at')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedBatches().map((batch) => (
                  <tr key={batch._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{batch.batch_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{batch.year}</td>
                    <td className="px-6 py-4">
                      <div className="truncate max-w-xs" title={batch.description}>
                        {batch.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{batch.place_id?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{batch.location_id?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(batch)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          batch.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {batch.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(batch.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(batch._id)}
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
        </div>
      )}

      {showForm && (
        <BatchForm
          onSubmit={selectedBatch ? handleUpdate : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setSelectedBatch(null);
          }}
          initialData={selectedBatch}
        />
      )}
    </div>
  );
};

export default BatchList;
