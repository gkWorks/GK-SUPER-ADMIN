// src/Pages/HomeService.jsx

import  { useState } from "react";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const HomeService = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
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
    <Navbar pagename={"Service Management"} />
  </div>
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          <p>Soon...</p>
        </div>
      </div>
    </div>
  );
};

export default HomeService;
