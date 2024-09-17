import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import React icons
import Menubar from '../Components/Manubar'; // Adjust import path if needed
import Navbar from '../Components/Navbar'; // Import the Navbar component
import MenuToggle from '../Components/MenuToggle'; // Import the MenuToggle component

const ShowcaseManagement = () => {
  const [companyName, setCompanyName] = useState('');
  const [branchUniqueId, setBranchUniqueId] = useState('');
  const [companyDetails, setCompanyDetails] = useState(null);
  const [branchDetails, setBranchDetails] = useState([]);
  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(true);
  const [editCompanyMode, setEditCompanyMode] = useState(false);
  const [editBranchMode, setEditBranchMode] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [updatedCompanyDetails, setUpdatedCompanyDetails] = useState({});
  const [updatedBranchDetails, setUpdatedBranchDetails] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ type: '', id: '' });

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCompanyDetails(null);
    setBranchDetails([]);

    try {
      const queryParams = new URLSearchParams({
        companyName,
        branchUniqueId: branchUniqueId || '',
      });

      const response = await fetch(`http://localhost:5000/api/companies/search?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setCompanyDetails(data.company);

      // If branchUniqueId is provided, filter the branches to only show the matching branch
      if (branchUniqueId) {
        const matchingBranch = data.company.branches.find(branch => branch.branchUniqueId === branchUniqueId);
        if (matchingBranch) {
          setBranchDetails([matchingBranch]); // Set only the matching branch
        } else {
          setError('Branch not found.');
        }
      } else {
        setBranchDetails(data.company.branches || []); // Set all branch details if no branchUniqueId is provided
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      setError('Company or Branch not found.');
    }
  };

  const handleEditCompanyClick = () => {
    setEditCompanyMode(true);
  };

  const handleEditBranchClick = (branch) => {
    setEditBranchMode(true);
    setSelectedBranch(branch); // Store selected branch to edit
  };

  const handleUpdateCompanySubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/companies/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, updatedDetails: updatedCompanyDetails }),
      });

      if (!response.ok) {
        throw new Error('Failed to update company data');
      }

      const data = await response.json();
      setCompanyDetails(data.company);
      setEditCompanyMode(false);
    } catch (error) {
      console.error('Error updating company details:', error);
      setError('Failed to update company details.');
    }
  };

  const handleUpdateBranchSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/companies/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, updatedDetails: updatedBranchDetails, branchUniqueId: selectedBranch.branchUniqueId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update branch data');
      }

      const data = await response.json();
      setBranchDetails(data.company.branches); // Refresh all branches after update
      setEditBranchMode(false);
    } catch (error) {
      console.error('Error updating branch details:', error);
      setError('Failed to update branch details.');
    }
  };

  const handleDeleteCompany = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/companies/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      setCompanyDetails(null);
      setBranchDetails([]);
      setConfirmDelete({ type: '', id: '' });
      setError('Company and all its branches successfully deleted.');
    } catch (error) {
      console.error('Error deleting company:', error);
      setError('Failed to delete company.');
    }
  };

  const handleDeleteBranch = async (branchUniqueId) => {
    try {
      const response = await fetch('http://localhost:5000/api/companies/delete-branch', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, branchUniqueId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete branch');
      }

      const data = await response.json();
      setBranchDetails(data.company.branches); // Refresh all branches after delete
      setConfirmDelete({ type: '', id: '' });
      setError('Branch successfully deleted.');
    } catch (error) {
      console.error('Error deleting branch:', error);
      setError('Failed to delete branch.');
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.type === 'company') {
      handleDeleteCompany();
    } else if (confirmDelete.type === 'branch') {
      handleDeleteBranch(confirmDelete.id);
    }
  };


        return (
          <div className="flex">
            {/* Fixed Menubar */}
            <div
        className={`fixed top-0 left-0 h-screen w-96 bg-gray-200 text-gray-500 overflow-y-auto lg:block ${
          showMenu ? "" : "hidden"
        }`}
      >
        <Menubar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 ml-96 p-4">
      <div className="fixed top-0 left-96 w-[calc(100%-24rem)] z-10 bg-white shadow-md">
    <Navbar pagename={"Search & Modifier"} />
  </div>
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="flex justify-center mt-4">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 pl-10">Company and BranchID Search</h1>
            <form onSubmit={handleSearchSubmit} className="relative p-6 rounded-lg shadow-md">
  <div className="flex items-center justify-between google-search-bar mb-4 p-1 rounded-full bg-gradient-animated animate-gradient-rotate border-2 pl-5 pb-2 border-red-200">
    <div className="w-3/4 pb-5 pt-3">
      <label className="block text-sm font-medium text-gray-700">Company Name:</label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
        className="mt-1 block w-45 px-2 py-2 pt-1 border-2 border-gray-700 shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white"
      />
    </div>

    <div className="relative pl-10 w-3/4  pb-1">
      <label className="block text-sm font-medium text-gray-700">Branch ID:</label>
      <input
        type="text"
        value={branchUniqueId}
        onChange={(e) => setBranchUniqueId(e.target.value)}
        className="mt-1 block w-10 px-2 py-1 border-2 border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white"
      />
    </div>

    <div className="ml-4 pr-5 pb-0">
      <button
        type="submit"
        className=" bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full shadow-md hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-transform duration-300 ease-in-out"
      >
        Search
      </button>
    </div>
  </div>
</form>

            {error && <p className="text-red-600 mt-4">{error}</p>}

            {companyDetails && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4">Company Details</h2>
                <p><strong>Company Name:</strong> {companyDetails.companyName}</p>
                <p><strong>Contact Person:</strong> {companyDetails.contactPerson}</p>
                <p><strong>Contact Number:</strong> {companyDetails.contactNumber}</p>
                <div className="mt-4">
                  <button onClick={handleEditCompanyClick} className="inline-flex items-center px-4 py-1 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaEdit className="mr-2" /> Edit 
                  </button>
                  <button onClick={() => setConfirmDelete({ type: 'company', id: companyDetails.companyName })} className="inline-flex items-center px-4 py-1 ml-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <FaTrashAlt className="mr-2" /> Delete 
                  </button>
                </div>
              </div>
            )}

            {editCompanyMode && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4">Edit Company Details</h2>
                <form onSubmit={handleUpdateCompanySubmit}>
                  {/* Include form fields to update company details */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Updated Contact Person:</label>
                    <input
                      type="text"
                      value={updatedCompanyDetails.contactPerson || ''}
                      onChange={(e) => setUpdatedCompanyDetails({ ...updatedCompanyDetails, contactPerson: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Updated Contact Number:</label>
                    <input
                      type="text"
                      value={updatedCompanyDetails.contactNumber || ''}
                      onChange={(e) => setUpdatedCompanyDetails({ ...updatedCompanyDetails, contactNumber: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Update Company</button>
                </form>
              </div>
            )}

            {branchDetails.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4">Branch Details</h2>
                <div className="grid grid-cols-1 gap-4">
                  {branchDetails.map((branch) => (
                    <div key={branch.branchUniqueId} className="border rounded-lg p-4 shadow-md">
                      <p><strong>Branch ID:</strong> {branch.branchId}</p>
                      <p><strong>Branch Name:</strong> {branch.branchName}</p>
                      <p><strong>Branch Unique ID:</strong> {branch.branchUniqueId}</p>
                      <button onClick={() => handleEditBranchClick(branch)} className="inline-flex items-center px-4 py-1 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2">
                        <FaEdit className="mr-2" /> Edit 
                      </button>
                      <button onClick={() => setConfirmDelete({ type: 'branch', id: branch.branchUniqueId })} className="inline-flex items-center px-4 py-1 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2 ml-2">
                        <FaTrashAlt className="mr-2" /> Delete 
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editBranchMode && selectedBranch && (
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-semibold mb-4">Edit Branch Details</h2>
                <form onSubmit={handleUpdateBranchSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Updated Branch Name:</label>
                    <input
                      type="text"
                      value={updatedBranchDetails.branchName || ''}
                      onChange={(e) => setUpdatedBranchDetails({ ...updatedBranchDetails, branchName: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Update Branch</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Popups */}
        {confirmDelete.type && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this {confirmDelete.type}?</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete({ type: '', id: '' })}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseManagement;
