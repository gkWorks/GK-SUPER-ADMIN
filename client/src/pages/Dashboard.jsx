import { useState } from "react";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";
import Card from "../Components/Dashboard-card";
import { reedem, service, users, revenue } from "../Assets"; // Ensure correct import paths

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex pt-10">
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
    <Navbar pagename={"Dashboard"} />
  </div>
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-6">
        </div>
        <div className="flex flex-wrap justify-between mt-10 mx-4 sm:justify-start">
          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-2 mb-4">
            <Card
              title={"  0 "}
              subtitle={"Total revenue from home service"}
              icon={revenue}
              color={"bg-gradient-to-r from-cyan-500 to-blue-500"}
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-2 mb-4">
            <Card
              title={"00"}
              subtitle={"Reward Points redeemed"}
              icon={reedem}
              color={"bg-gradient-to-r from-purple-500 to-pink-500"}
            />
          </div>
          <div className="w-full lg:w-1/4 px-2 mb-4">
            <Card
              title={"000"}
              subtitle={"Top Products/Services"}
              icon={service}
              color={"bg-gradient-to-r from-amber-400 to-amber-600"}
            />
          </div>
          <div className="w-full lg:w-1/4 px-2 mb-4">
            <Card
              title={"0000"}
              subtitle={"New Users"}
              icon={users}
              color={"bg-gradient-to-r from-lime-400 to-lime-600"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
