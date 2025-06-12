import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../../utils/axiosConfig";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return "Invalid Date";
  }
};

const UserDetailPanel = ({ user, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [packageData, setPackageData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [fees, setFees] = useState([]);
  const [terminalData, setTerminalData] = useState([]);

  const tabs = [
    { id: "details", label: "User Detail" },
    { id: "package", label: "Package" },
    { id: "logs", label: "User Logs" },
    { id: "fees", label: "Fees" },
    { id: "terminal", label: "Terminal" }
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?._id) return;

      try {
        if (activeTab === 'package' && user.packageId) {
          const response = await axios.get(`/api/packages/${user.packageId}`);
          if (isMounted) setPackageData(response.data);
        } else if (activeTab === 'logs') {
          const response = await axios.get(`/api/users/${user._id}/logs`);
          if (isMounted) setLogs(response.data || []);
        } else if (activeTab === 'fees') {
          const response = await axios.get(`/api/users/${user._id}/fees`);
          if (isMounted) setFees(response.data || []);
        } else if (activeTab === 'terminal') {
          const response = await axios.get(`/api/users/${user._id}/terminals`);
          if (isMounted) setTerminalData(response.data || []);
        }
      } catch (err) {
        console.error(`Error loading ${activeTab} data:`, err);
        if (isMounted) {
          // Reset state on error
          if (activeTab === 'package') setPackageData(null);
          else if (activeTab === 'logs') setLogs([]);
          else if (activeTab === 'fees') setFees([]);
          else if (activeTab === 'terminal') setTerminalData([]);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [activeTab, user?._id, user?.packageId]);

  // Get the content for the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-6">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{user.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Middle Name</p>
                  <p className="font-medium">{user.middleName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User Type</p>
                  <p className="font-medium">{user.userType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unique Number</p>
                  <p className="font-medium">{user.uniqueNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-medium">{user.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDateTime(user.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={
                    user.isActive
                      ? "inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                      : "inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                  }>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Address Line 1</p>
                  <p className="font-medium">{user.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address Line 2</p>
                  <p className="font-medium">{user.address2 || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address Line 3</p>
                  <p className="font-medium">{user.address3 || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{user.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{user.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile No.</p>
                  <p className="font-medium">{user.mobileNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {user.remarks && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Remarks</h3>
                <p className="text-gray-600">{user.remarks}</p>
              </div>
            )}

            {/* User Photo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Photo</h3>
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <img 
                  src={user.photo || "https://via.placeholder.com/150"} 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );

      case "package":
        return (
          <div className="space-y-6">
            {packageData ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Package Name</p>
                    <p className="font-medium">{packageData.packageName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Package Type</p>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {packageData.packageType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">₹{packageData.packagePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{packageData.packageLocation?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Validity</p>
                    <p className="font-medium">{formatDateTime(packageData.validityDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{packageData.duration} months</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No package information available
              </div>
            )}
          </div>
        );

      case "logs":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Activity Logs</h3>
            {logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="text-sm font-medium text-gray-900">{log.activity}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{formatDateTime(log.timestamp)}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{log.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No activity logs found
              </div>
            )}
          </div>
        );

      case "fees":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Details</h3>
            {fees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Packages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fees.map((fee, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.semester}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(fee.paymentDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.paymentMode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.remark}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.numberOfPackages}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {fee.document && (
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(fee.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.createdBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button className="text-gray-600 hover:text-gray-900">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No fee records found
              </div>
            )}
          </div>
        );

      case "terminal":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Terminal Information</h3>
            {terminalData.length > 0 ? (
              <div className="space-y-4">
                {terminalData.map((terminal, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        terminal.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium text-gray-900">{terminal.deviceName}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">IP Address</p>
                        <p className="font-medium">{terminal.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{terminal.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Active</p>
                        <p className="font-medium">{formatDateTime(terminal.lastActive)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className={`font-medium capitalize ${
                          terminal.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {terminal.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No terminal information available
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="relative p-6 border-b">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={user.profilePhoto || "https://via.placeholder.com/100"}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <span className="inline-block px-3 py-1 mt-2 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "px-4 py-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600"
                  : "px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto" style={{ height: "calc(100vh - 280px)" }}>
        {getTabContent()}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
        <button
          onClick={() => onEdit(user)}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Edit User
        </button>
      </div>
    </div>
  );
};

UserDetailPanel.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    employeeCode: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    role: PropTypes.string,
    batch: PropTypes.string,
    profilePhoto: PropTypes.string,
    isActive: PropTypes.bool,
    packageId: PropTypes.string,
    createdAt: PropTypes.string,
    dateOfBirth: PropTypes.string,
    bloodGroup: PropTypes.string,
    type: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    address: PropTypes.string,
    remark: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default UserDetailPanel;
