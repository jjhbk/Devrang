"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, ProductsIcon, CustomersIcon, BookingsIcon, CartIcon } from './Icons';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const navLinkClasses = "flex items-center px-6 py-3 text-gray-200 hover:bg-primary-focus hover:text-white transition-colors duration-200";
  const activeLinkClasses = "bg-primary-focus text-white";

  const getLinkClass = (path: string) => {
    return `${navLinkClasses} ${pathname === path ? activeLinkClasses : ''}`;
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-primary text-white">
      <div className="flex items-center justify-center h-20 border-b border-purple-800">
        <h1 className="text-2xl font-bold tracking-wider">AstroGems</h1>
      </div>
      <nav className="flex-1 mt-6">
        <Link href="/dashboard" className={getLinkClass('/dashboard')}>
          <DashboardIcon className="w-6 h-6" />
          <span className="mx-4">Dashboard</span>
        </Link>
        <Link href="/products" className={getLinkClass('/products')}>
          <ProductsIcon className="w-6 h-6" />
          <span className="mx-4">Products</span>
        </Link>
        <Link href="/customers" className={getLinkClass('/customers')}>
          <CustomersIcon className="w-6 h-6" />
          <span className="mx-4">Customers</span>
        </Link>
        <Link href="/bookings" className={getLinkClass('/bookings')}>
          <BookingsIcon className="w-6 h-6" />
          <span className="mx-4">Bookings</span>
        </Link>
        <Link href="/cart" className={getLinkClass('/cart')}>
          <CartIcon className="w-6 h-6" />
          <span className="mx-4">Cart / New Booking</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
