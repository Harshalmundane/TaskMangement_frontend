import clsx from "clsx";
import React from "react";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdLogout,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Status",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[0];
    
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
          "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
          isActive
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
        )}
        
        {/* Icon */}
        <span className={clsx(
          "text-xl transition-transform duration-200",
          isActive ? "scale-110" : "group-hover:scale-110"
        )}>
          {el.icon}
        </span>
        
        {/* Label */}
        <span className="flex-1">{el.label}</span>
        
        {/* Hover effect */}
        {!isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
        )}
      </Link>
    );
  };

  return (
    <div className='w-full h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800'>
      {/* Header/Logo */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-800'>
        <div className='flex items-center gap-3 group cursor-pointer'>
          <div className='relative'>
            <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:shadow-xl group-hover:shadow-indigo-500/70 transition-all duration-300 transform group-hover:rotate-6'>
              <MdOutlineAddTask className='text-white text-2xl' />
            </div>
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse' />
          </div>
          <div className='flex flex-col'>
            <span className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              TaskFlow
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
              Workspace Pro
            </span>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className='mx-4 mt-6 mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-indigo-100 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md'>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-gray-900 dark:text-white truncate text-sm'>
              {user?.name}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400 capitalize'>
              {user?.role || 'Member'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2 text-xs'>
          <div className='flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded-lg flex-1'>
            <HiSparkles className='text-yellow-500' />
            <span className='text-gray-700 dark:text-gray-300 font-medium'>12 Tasks</span>
          </div>
          <div className='flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded-lg flex-1'>
            <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
            <span className='text-gray-700 dark:text-gray-300 font-medium'>Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 px-4 py-2 space-y-1 overflow-y-auto'>
        <p className='px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
          Main Menu
        </p>
        {sidebarLinks.slice(0, 2).map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
        
        <div className='pt-4'>
          <p className='px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
            Task Categories
          </p>
          {sidebarLinks.slice(2, 5).map((link) => (
            <NavLink el={link} key={link.label} />
          ))}
        </div>
        
        {user?.isAdmin && (
          <div className='pt-4'>
            <p className='px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Management
            </p>
            {sidebarLinks.slice(5).map((link) => (
              <NavLink el={link} key={link.label} />
            ))}
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-800 space-y-2'>
        <button className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 font-medium group'>
          <MdSettings className='text-xl group-hover:rotate-90 transition-transform duration-300' />
          <span>Settings</span>
        </button>
        
        <button className='w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 font-medium group'>
          <MdLogout className='text-xl group-hover:translate-x-1 transition-transform duration-200' />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;