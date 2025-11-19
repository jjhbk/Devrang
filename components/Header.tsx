"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserCircle, LogOut, Sun } from "lucide-react";

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 
      bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200"
    >
      {/* Left section (brand or breadcrumbs) */}
      <div className="md:hidden flex items-center gap-2">
        <Sun className="w-6 h-6 text-orange-500" />
        <h1 className="text-xl font-bold tracking-wider text-red-900 uppercase font-sans">
          Devrang
        </h1>
      </div>
      <div className="hidden md:block">
        {/* Placeholder for page title or breadcrumb if needed, otherwise empty to push user to right */}
        <span className="text-stone-500 text-sm font-medium tracking-wide">
          Welcome back
        </span>
      </div>

      {/* Right: user avatar dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative z-10 flex items-center justify-center h-10 w-10 rounded-full 
            border border-stone-300 bg-white text-stone-600 shadow-sm 
            hover:shadow-md transition-all duration-200 focus:outline-none"
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="User"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="w-6 h-6" />
          )}
        </button>

        {dropdownOpen && (
          <>
            <div
              onClick={() => setDropdownOpen(false)}
              className="fixed inset-0 z-10"
            ></div>

            <div
              className="absolute right-0 mt-3 w-56 bg-white 
              border border-stone-100 rounded-lg shadow-xl z-20 overflow-hidden ring-1 ring-black ring-opacity-5"
            >
              {status === "authenticated" ? (
                <>
                  <div className="px-4 py-3 bg-stone-50/50">
                    <p className="text-sm font-serif font-semibold text-stone-800">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  <div className="border-t border-stone-100"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 
                      text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-900 
                      transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-3 text-sm text-stone-500">
                  Not signed in
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
