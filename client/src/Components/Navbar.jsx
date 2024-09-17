import { demouser } from "../Assets/index";
import { useEffect, useState } from "react";

const Navbar = ({ pagename }) => {
  const [name, setName] = useState(""); // State for storing the name

  useEffect(() => {
    // Get the name and role from localStorage after login or registration
    const userName = localStorage.getItem("name");
    setName(userName || "Guest"); // Default to "Guest" if no name is found
  }, []);

  // Date and Time logic
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  return (
    <nav className="bg-white flex items-center justify-between h-20 px-8 shadow-sm">
      {/* Left Section: Page Name */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-500">{pagename}</h1>
      </div>
      <div className="text-sm text-gray-400 flex-1 text-center">
        {date} &nbsp; {currentTime}
      </div>

      {/* Center Section: Date and Time */}

      {/* Right Section: User Avatar and Info */}
      <div className="flex items-center">
        <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center mr-4">
          <img src={demouser} alt="avatar" className="rounded-full h-8 w-8" />
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-medium">Gk MiCro</span> {/* Display the role */}
          <span>{name}</span> {/* Display the name */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
