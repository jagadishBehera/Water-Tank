import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { MdCardMembership } from "react-icons/md";

const SidebarsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  const classes = {
    active:
      "flex items-center block px-4 py-3 mt-2 text-md font-semibold tracking-wide text-white bg-[#2E3A8C] rounded-lg focus:outline-none focus:shadow-outline transition ease-in-out duration-300 transform hover:translate-x-2 cursor-pointer",
    inactive:
      "flex items-center block px-4 py-3 mt-2 text-md font-semibold tracking-wide text-[#49608c] bg-transparent rounded-lg hover:text-[#ffffff] hover:bg-[#4F68A4] transition ease-in-out duration-300 transform hover:translate-x-2 focus:outline-none focus:shadow-outline cursor-pointer",
  };

  // Dynamic Sidebar Menu Items
  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <BiSolidDashboard size={24} />,
    },
    { path: "/admin/data", label: "Master", icon: <FaUserTie size={24} /> },
    {
      path: "/admin/report",
      label: "Report",
      icon: <MdCardMembership size={24} />,
    },
  ];

  const handleClick = (path) => {
    navigate(path);
    setSelectedItem(path);
  };

  return (
    <div>
      {menuItems.map((item) => (
        <div
          key={item.path}
          className={
            selectedItem === item.path ? classes.active : classes.inactive
          }
          onClick={() => handleClick(item.path)}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SidebarsContent;
