"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, LogoutIcon } from './Icons';

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="flex items-center">
        {/* Placeholder for breadcrumbs or page title */}
      </div>
      <div className="flex items-center">
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative z-10 block h-10 w-10 overflow-hidden rounded-full shadow focus:outline-none flex items-center justify-center bg-primary text-white">
             <UserCircleIcon className="w-8 h-8"/>
          </button>
          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 h-full w-full z-10"></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20">
                <div className="px-4 py-2 text-sm text-gray-700 font-semibold">{user?.name}</div>
                <div className="px-4 py-2 text-xs text-gray-500">{user?.email}</div>
                <div className="border-t border-gray-200"></div>
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white">
                  <LogoutIcon className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
