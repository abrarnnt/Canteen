// src/components/Layout/Topbar.jsx

const Topbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Super Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span>Welcome Admin</span>
      </div>
    </div>
  );
};

export default Topbar;
