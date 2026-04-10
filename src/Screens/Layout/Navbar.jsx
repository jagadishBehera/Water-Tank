import React, { useEffect, useState } from 'react';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { FaBell } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { MdMarkEmailUnread } from 'react-icons/md';
import AdminProfileDropDown from '../../Components/Admin/AdminProfileDropDown';
import NotificationBell from '../../Components/Admin/Notifications/NotificationBell';

const Navbar = ({ toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock notification counts (replace with API later)
  const [notifications, setNotifications] = useState(5);
  const [messages, setMessages] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    return month >= 4
      ? `FY ${year}-${year + 1}`
      : `FY ${year - 1}-${year}`;
  };

  return (
    <div className="w-full h-16 bg-white flex items-center text-[#49608c] shadow z-50 sticky top-4 px-4">

      {/* Sidebar Toggle */}
      <AiOutlineMenuUnfold
        className="cursor-pointer mr-4 hover:text-[#2E3A8C] transition"
        onClick={toggleSidebar}
        size={25}
      />

      {/* Center Info */}
      <div className="hidden md:flex items-center gap-4 text-sm font-medium">

        <span className="bg-blue-50 px-3 py-1 rounded-full">
          {getFinancialYear()}
        </span>

        <span className="bg-gray-50 px-3 py-1 rounded-full">
          ⏰ {currentTime.toLocaleTimeString()}
        </span>
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-5">

        {/* Notifications */}
        {/* <div className="relative cursor-pointer hover:text-[#2E3A8C] transition">
          <IoMdNotifications size={24} />

          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {notifications}
            </span>
          )}
        </div> */}

        <NotificationBell />

        {/* Messages */}
        <div className="relative cursor-pointer hover:text-[#2E3A8C] transition">
          <MdMarkEmailUnread size={24} />

          {messages > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {messages}
            </span>
          )}
        </div>

        {/* Bell (optional extra alert) */}
        {/* <div className="cursor-pointer hover:text-[#2E3A8C] transition">
          <FaBell size={22} />
        </div> */}

        {/* Profile */}
        <AdminProfileDropDown />
      </div>
    </div>
  );
};

export default Navbar;