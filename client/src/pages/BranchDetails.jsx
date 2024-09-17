import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Menubar from '../Components/Manubar';
import MenuToggle from '../Components/MenuToggle';
import Navbar from '../Components/Navbar';

const BranchDetails = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [company, setCompany] = useState(null);
  const { companyName } = useParams(); // Get companyName from URL parameters

  const handleMenuToggle = () => {
    setShowMenu(prevShowMenu => !prevShowMenu);
  };

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/company/${encodeURIComponent(companyName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company details');
      }
      const data = await response.json();
      console.log('Company data:', data); // Log to verify the structure
      setCompany(data.company);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };
  

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyName]);

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
    <Navbar pagename={"Search & Modifier"} />
  </div>
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        {company ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{company.companyName}</h2>
            <p><strong>Contact Person:</strong> {company.contactPerson}</p>
            <p><strong>Contact Number:</strong> {company.contactNumber}</p>
            <p><strong>Address:</strong> {company.address}</p>
            <p><strong>Date of Start:</strong> {new Date(company.dateOfStart).toLocaleDateString()}</p>
            <p><strong>Mode of AMC:</strong> {company.modeOfAmc}</p>
            <p> <strong>Reg NO:</strong> {company.regNo} </p>

            <h3 className="mt-6 text-lg font-semibold">Branches</h3>
            {company.branches && company.branches.length > 0 ? (
              <table className="min-w-full mt-4 bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Branch Name</th>
                    <th className="border px-4 py-2">Contact Person</th>
                    <th className="border px-4 py-2">Contact Number</th>
                    <th className="border px-4 py-2">Address</th>
                    <th className="border px-4 py-2">AMC</th>
                    <th className="border px-4 py-2">Start Date</th>
                    <th className="border px-4 py-2">Unique ID</th>
                  </tr>
                </thead>
                <tbody>
                  {company.branches.map((branch, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{branch.branchName}</td>
                      <td className="border px-4 py-2">{branch.branchContactPerson}</td>
                      <td className="border px-4 py-2">{branch.branchContactNumber}</td>
                      <td className="border px-4 py-2">{branch.branchAddress}</td>
                      <td className="border px-4 py-2">{branch.branchAmc}</td>
                      <td className="border px-4 py-2">{new Date(branch.branchStartDate).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{branch.branchUniqueId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No branches available.</p>
            )}
          </div>
        ) : (
          <p>Loading company details...</p>
        )}
      </div>
    </div>
  );
};

export default BranchDetails;
