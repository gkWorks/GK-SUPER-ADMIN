import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const UserManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state added
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMenuToggle = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data.customers);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching customers:", error);
      setLoading(false); // Ensure loading is false even if there's an error
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleBranchClick = (companyName) => {
    navigate(`/branches/${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="flex pt-20">
      {/* Fixed Menubar */}
      <div
        className={`fixed top-0 left-0 h-screen w-96 bg-gray-200 text-gray-500 lg:block ${
          showMenu ? "" : "hidden"
        }`}
      >
        <Menubar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 ml-96 p-4">
      <div className="fixed top-0 left-96 w-[calc(100%-24rem)] z-10 bg-white shadow-md">
    <Navbar pagename={"Showcase Data"} />
  </div>
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          {loading ? ( // Conditional rendering for loading state
            <div className="flex justify-center items-center h-64">
              <p className="text-xl font-semibold text-gray-600 pt-60">
                Just a sec...
              </p>
              {/* Optional spinner */}
              <div className="loader ml-4"></div> {/* Add a spinner if needed */}
            </div>
          ) : (
            <table className="min-w-full mt-4 bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Company Name</th>
                  <th className="border px-4 py-2">Contact Person</th>
                  <th className="border px-4 py-2">Contact Number</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Date of Start</th>
                  <th className="border px-4 py-2">Mode of AMC</th>
                  <th className="border px-4 py-2">Branch Count</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="border px-4 py-2">{customer.companyName}</td>
                    <td className="border px-4 py-2">{customer.contactPerson}</td>
                    <td className="border px-4 py-2">{customer.contactNumber}</td>
                    <td className="border px-4 py-2">{customer.address}</td>
                    <td className="border px-4 py-2">
                      {new Date(customer.dateOfStart).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{customer.modeOfAmc}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleBranchClick(customer.companyName)}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 ml-10"
                      >
                        {customer.branches ? customer.branches.length : 0}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;