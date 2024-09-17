import { useState, useEffect } from "react";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const CustomerManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [branch, setBranch] = useState("No");
  const [companyType, setCompanyType] = useState(""); // Track whether it's an existing or new company
  const [formData, setFormData] = useState({
    companyName: "", // Initialize with empty string
    regNo: "",
    contactPerson: "",
    contactNumber: "",
    address: "",
    dateOfStart: "", // Initialize with empty string for the date
    modeOfAmc: "No AMC",
    companyUsername: "", // New field for company username
    companyPassword: "", // New field for company password
    branchName: "",
    branchContactPerson: "",
    branchContactNumber: "",
    branchAddress: "",
    branchAmc: "No AMC", // New field for branch AMC
    branchStartDate: "", // New field for branch Start Date
    branchUniqueId: "", // New field for branch Unique ID
    branchUsername: "", // New field for branch username
    branchPassword: "", // New field for branch password
  });

  useEffect(() => {
    if (companyType === "New") {
      const fetchRegNo = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/customers");
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          const newRegNo = data.companyRegNo + 1;
          setFormData((prevData) => ({
            ...prevData,
            regNo: `${newRegNo}.0`,
          }));
        } catch (error) {
          console.error("Error fetching registration number:", error);
        }
      };
      fetchRegNo();
    }
  }, [companyType]);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerData = { ...formData, branch };
    let newBranchRegNo = ""; // Declare newBranchRegNo here

    // If the branch is set to "No", remove branch-related data
    if (branch === "No") {
      delete customerData.branchName;
      delete customerData.branchContactPerson;
      delete customerData.branchContactNumber;
      delete customerData.branchAddress;
      delete customerData.branchAmc; // Ensure to delete if not used
      delete customerData.branchStartDate; // Ensure to delete if not used
      delete customerData.branchUniqueId; // Ensure to delete if not used
      delete customerData.branchUsername; // Ensure to delete if not used
      delete customerData.branchPassword; // Ensure to delete if not used
      customerData.branches = [];
    } else {
      // If branch is set to "Yes", structure branch data into an array
      if (companyType === "Existing") {
        // Verify if company exists
        const responseVerify = await fetch(
          `http://localhost:5000/api/customers/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: formData.companyName,
              regNo: formData.regNo,
            }),
          }
        );

        const data = await responseVerify.json();
        if (responseVerify.ok && data.success) {
          // Get latest branch regNo for the company
          const responseBranch = await fetch(
            `http://localhost:5000/api/customers/getLatestBranchRegNo/${formData.companyName}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const branchData = await responseBranch.json();
          const branchCount = branchData.branches
            ? branchData.branches.length
            : 0;
          newBranchRegNo =
            branchCount > 0
              ? `${branchData.regNo}.${branchCount}`
              : `${branchData.regNo}`;
        }
      } else {
        // For new companies, newBranchRegNo is not used
        newBranchRegNo = formData.regNo;
      }

      customerData.branches = [
        {
          branchName: formData.branchName,
          branchContactPerson: formData.branchContactPerson,
          branchContactNumber: formData.branchContactNumber,
          branchAddress: formData.branchAddress,
          branchAmc: formData.branchAmc,
          branchStartDate: formData.branchStartDate,
          branchUniqueId: newBranchRegNo,
          branchUsername: formData.branchUsername,
          branchPassword: formData.branchPassword,
        },
      ];
    }

    // Different API endpoints or logic for new/existing company
    let response;
    if (companyType === "Existing") {
      // Add branch to existing company
      response = await fetch(`http://localhost:5000/api/customers/addBranch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          regNo: formData.regNo,
          branchName: formData.branchName,
          branchContactPerson: formData.branchContactPerson,
          branchContactNumber: formData.branchContactNumber,
          branchAddress: formData.branchAddress,
          branchAmc: formData.branchAmc,
          branchStartDate: formData.branchStartDate,
          branchUniqueId: newBranchRegNo, // Assign new branch regNo
          branchUsername: formData.branchUsername,
          branchPassword: formData.branchPassword,
        }),
      });
    } else {
      // Create a new company
      response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });
    }

    if (response.ok) {
      const data = await response.json();
      console.log("Customer saved:", data);

      setFormData({
        companyName: "",
        regNo: "",
        contactPerson: "",
        contactNumber: "",
        address: "",
        dateOfStart: "",
        modeOfAmc: "No AMC",
        companyUsername: "", // New field for company username
        companyPassword: "", // New field for company password
        branchName: "",
        branchContactPerson: "",
        branchContactNumber: "",
        branchAddress: "",
        branchAmc: "No AMC", // Reset new field
        branchStartDate: "", // Reset new field
        branchUniqueId: "", // Reset new field
        branchUsername: "", // New field for branch username
        branchPassword: "", // New field for branch password
      });

      setBranch("No");
    } else {
      console.error("Failed to save customer");
    }
  };

  return (
    <div className="flex">
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
    <Navbar pagename={"Birth Case"} />
  </div>
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />

        <form className="mt-8 space-y-4 pt-20" onSubmit={handleSubmit}>
          {/* Select Existing or New Company */}
          <div>
            <label className="block text-gray-700">Select Company Type</label>
            <select
              name="companyType"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select</option>
              <option value="Existing">Existing Company</option>
              <option value="New">New Company</option>
            </select>
          </div>

          {companyType === "Existing" && (
            <>
              <div>
                <label className="block text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Reg No</label>
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          {companyType === "New" && (
            <>
              <div>
                <label className="block text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              {/* <div>
                <label className="block text-gray-700">Reg No</label>
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div> */}
              <div>
                <label className="block text-gray-700">Date of Start</label>
                <input
                  type="date"
                  name="dateOfStart"
                  value={formData.dateOfStart || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Mode of AMC</label>
                <select
                  name="modeOfAmc"
                  value={formData.modeOfAmc || "No AMC"} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="No AMC">No AMC</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Halfly">Halfly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Company Username</label>
                <input
                  type="text"
                  name="companyUsername"
                  value={formData.companyUsername}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Company Password</label>
                <input
                  type="password"
                  name="companyPassword"
                  value={formData.companyPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          {companyType && (
            <>
              <div>
                <label className="block text-gray-700">Branch</label>
                <select
                  name="branch"
                  value={branch || "No"} // Ensure a controlled value
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {branch === "Yes" && (
                <>
                  <div>
                    <label className="block text-gray-700">Branch Name</label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Contact Person
                    </label>
                    <input
                      type="text"
                      name="branchContactPerson"
                      value={formData.branchContactPerson || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Contact Number
                    </label>
                    <input
                      type="tel"
                      name="branchContactNumber"
                      value={formData.branchContactNumber || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Address
                    </label>
                    <textarea
                      name="branchAddress"
                      value={formData.branchAddress || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Branch AMC</label>
                    <select
                      name="branchAmc"
                      value={formData.branchAmc || "No AMC"} // Ensure controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="No AMC">No AMC</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Halfly">Halfly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Start Date
                    </label>
                    <input
                      type="date"
                      name="branchStartDate"
                      value={formData.branchStartDate || ""} // Ensure controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Username
                    </label>
                    <input
                      type="text"
                      name="branchUsername"
                      value={formData.branchUsername}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Password
                    </label>
                    <input
                      type="password"
                      name="branchPassword"
                      value={formData.branchPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-gray-700">
                      Branch Unique ID
                    </label>
                    <input
                      type="text"
                      name="branchUniqueId"
                      value={formData.branchUniqueId || ""} // Ensure controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div> */}
                </>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerManagement;
