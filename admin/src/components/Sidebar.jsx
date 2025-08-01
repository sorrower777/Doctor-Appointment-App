import React from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";
import { useContext } from "react";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);

  console.log("Sidebar rendering, aToken:", aToken); // Debug log

  const menuItems = [
    {
      path: "/admin-dashboard",
      icon: assets.home_icon,
      label: "Dashboard",
      description: "Overview and statistics",
    },
    {
      path: "/all-appointments",
      icon: assets.appointment_icon,
      label: "Appointments",
      description: "Manage all appointments",
    },
    {
      path: "/add-doctor",
      icon: assets.add_icon,
      label: "Add Doctor",
      description: "Register new doctor",
    },
    {
      path: "/doctor-list",
      icon: assets.people_icon,
      label: "Doctor List",
      description: "View all doctors",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-sm">
      {aToken && (
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <img src={assets.admin_logo} alt="Admin" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500">Medical Center</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out
                      ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/25"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${({
                        isActive,
                      }) =>
                        isActive
                          ? "bg-white/20"
                          : "bg-gray-100 group-hover:bg-gray-200"}`}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-5 h-5 object-contain filter transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-xs opacity-75 truncate">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">
                    System Status
                  </p>
                  <p className="text-xs text-green-600">
                    All systems operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
