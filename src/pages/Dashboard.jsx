import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdTrendingUp,
} from "react-icons/md";
import { Chart, Loading, UserInfo } from "../components";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";

const Card = ({ label, count, bg, icon, trend }) => {
  return (
    <div className='group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700'>
      {/* Gradient overlay */}
      <div className={clsx('absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300', bg)} />
      
      <div className='relative p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className={clsx(
            'w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300',
            bg
          )}>
            <span className='text-2xl'>{icon}</span>
          </div>
          {trend && (
            <div className='flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full'>
              <MdTrendingUp className='text-sm' />
              <span>+12%</span>
            </div>
          )}
        </div>

        <div className='space-y-1'>
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
            {label}
          </p>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {count}
          </p>
          <p className='text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1'>
            <span className='inline-block w-1 h-1 bg-gray-400 rounded-full' />
            Updated just now
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={clsx('h-1 w-full', bg)} />
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error } = useGetDasboardStatsQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const totals = data?.tasks || [];

  if (isLoading)
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );

  const stats = [
    {
      _id: "1",
      label: "Total Tasks",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: true,
    },
    {
      _id: "2",
      label: "Completed",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      trend: true,
    },
    {
      _id: "3",
      label: "In Progress",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-gradient-to-br from-amber-500 to-amber-600",
      trend: false,
    },
    {
      _id: "4",
      label: "To Do",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: false,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats?.map(({ icon, bg, label, total, trend }, index) => (
            <Card 
              key={index} 
              icon={icon} 
              bg={bg} 
              label={label} 
              count={total}
              trend={trend}
            />
          ))}
        </div>

        {/* Chart Section */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden'>
          <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Performance Analytics
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Task distribution by priority level
                </p>
              </div>
              <div className='flex gap-2'>
                <button className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
                  Week
                </button>
                <button className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors'>
                  Month
                </button>
              </div>
            </div>
          </div>
          <div className='p-6'>
            <Chart data={data?.graphData} />
          </div>
        </div>

        {/* Tables Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Tasks */}
          {data && (
            <div className={user?.isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <TaskTable tasks={data?.last10Task} />
            </div>
          )}
          
          {/* Recent Users - Only for Admin */}
          {data && user?.isAdmin && (
            <div className='lg:col-span-1'>
              <UserTable users={data?.users} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead>
      <tr className='border-b border-gray-200 dark:border-gray-700'>
        <th className='py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
          User
        </th>
        <th className='py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
          Status
        </th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md'>
              {getInitials(user?.name)}
            </div>
            {user?.isActive && (
              <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full' />
            )}
          </div>
          <div>
            <p className='font-medium text-gray-900 dark:text-white text-sm'>
              {user.name}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400 capitalize'>
              {user?.role}
            </p>
          </div>
        </div>
      </td>

      <td className='py-4 px-4'>
        <div className='flex flex-col gap-1'>
          <span className={clsx(
            'inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold',
            user?.isActive 
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
          )}>
            {user?.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className='text-xs text-gray-400 dark:text-gray-500'>
            {moment(user?.createdAt).fromNow()}
          </span>
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden'>
      <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
          Team Members
        </h3>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          {users?.length} active users
        </p>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {users?.map((user, index) => (
              <TableRow key={index + user?._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead>
      <tr className='border-b border-gray-200 dark:border-gray-700'>
        <th className='py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
          Task
        </th>
        <th className='py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
          Priority
        </th>
        <th className='py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
          Team
        </th>
        <th className='py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell'>
          Created
        </th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group'>
      <td className='py-4 px-4'>
        <div className='flex items-center gap-3'>
          <div className={clsx(
            'w-2.5 h-2.5 rounded-full shadow-sm',
            TASK_TYPE[task.stage]
          )} />
          <p className='font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
            {task?.title}
          </p>
        </div>
      </td>

      <td className='py-4 px-4'>
        <div className='flex items-center gap-2'>
          <span className={clsx(
            'text-xl',
            PRIOTITYSTYELS[task?.priority]
          )}>
            {ICONS[task?.priority]}
          </span>
          <span className='capitalize text-sm font-medium text-gray-700 dark:text-gray-300'>
            {task?.priority}
          </span>
        </div>
      </td>

      <td className='py-4 px-4'>
        <div className='flex -space-x-2'>
          {task?.team.slice(0, 3).map((m, index) => (
            <div
              key={index}
              className={clsx(
                'w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-800 shadow-sm hover:z-10 transition-transform hover:scale-110',
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
          {task?.team.length > 3 && (
            <div className='w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-800 text-gray-600 dark:text-gray-400'>
              +{task?.team.length - 3}
            </div>
          )}
        </div>
      </td>

      <td className='py-4 px-4 hidden md:table-cell'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden'>
      <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
              Recent Tasks
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Latest 10 tasks from your workspace
            </p>
          </div>
          <button className='px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors'>
            View All
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks.map((task, id) => (
              <TableRow key={task?._id + id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;