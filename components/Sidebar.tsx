"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  ShoppingCart,
  Sun,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const baseLinkClasses =
    "flex items-center gap-3 px-6 py-3 text-stone-400 hover:text-stone-100 transition-all duration-300 rounded-xl mx-3 my-1";
  const activeLinkClasses =
    "bg-amber-900/40 text-amber-50 shadow-inner shadow-black/20";

  const getLinkClass = (path: string) => {
    return `${baseLinkClasses} ${
      pathname === path ? activeLinkClasses : "hover:bg-stone-800"
    }`;
  };

  return (
    <aside
      className="hidden md:flex flex-col w-64 
      bg-stone-900 border-r border-stone-800 shadow-2xl"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-center h-24 border-b border-stone-800 gap-3">
        <Sun className="w-8 h-8 text-orange-500" />
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-sans">
          Devrang
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8 space-y-2">
        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">Dashboard</span>
        </Link>
        <Link href="/products" className={getLinkClass("/products")}>
          <Package className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">Products</span>
        </Link>
        <Link href="/customers" className={getLinkClass("/customers")}>
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">Customers</span>
        </Link>
        <Link href="/bookings" className={getLinkClass("/bookings")}>
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">Bookings</span>
        </Link>
        <Link href="/cart" className={getLinkClass("/cart")}>
          <ShoppingCart className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">Cart / New Booking</span>
        </Link>
      </nav>

      {/* Footer / Signature */}
      <div className="mt-auto py-6 border-t border-stone-800 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} devrang</p>
      </div>
    </aside>
  );
};

export default Sidebar;
