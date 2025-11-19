"use client";

import React from "react";
import Link from "next/link";
import { useAppContext } from "../../../context/AppContext";
import { BookingStatus } from "../../../types";
import { ShoppingCart, Users, Gem, Calendar } from "lucide-react";

const DashboardCard: React.FC<{
  title: string;
  value: string;
  description: string;
}> = ({ title, value, description }) => (
  <div className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">{title}</h3>
    <p className="mt-3 text-3xl font-serif text-amber-900">{value}</p>
    <p className="mt-2 text-sm text-stone-400">{description}</p>
  </div>
);

const QuickLink: React.FC<{
  to: string;
  label: string;
  icon: React.ReactNode;
}> = ({ to, label, icon }) => (
  <Link
    href={to}
    className="flex flex-col items-center justify-center p-8 bg-white border border-stone-100 rounded-lg shadow-sm text-center hover:shadow-md hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300 group"
  >
    <div className="mb-4 text-stone-400 group-hover:text-amber-700 group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <span className="text-lg font-medium text-stone-700 group-hover:text-amber-900">
      {label}
    </span>
  </Link>
);

const DashboardPage: React.FC = () => {
  const { bookings } = useAppContext();
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(
      (b) =>
        b.status === BookingStatus.Paid || b.status === BookingStatus.Delivered
    )
    .reduce((sum, b) => sum + b.total, 0);
  const pendingPayout = totalRevenue * 0.7; // Assume 70% payout

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-amber-900 mb-2">Overview</h1>
        <p className="text-stone-500">Welcome back to your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <DashboardCard
          title="Total Bookings"
          value={totalBookings.toString()}
          description="All time bookings"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          description="From paid bookings"
        />
        <DashboardCard
          title="Pending Payout"
          value={`$${pendingPayout.toFixed(2)}`}
          description="Estimated payout"
        />
      </div>

      <h2 className="text-2xl font-serif text-amber-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickLink
          to="/cart"
          label="New Booking"
          icon={<ShoppingCart className="w-8 h-8" />}
        />
        <QuickLink
          to="/customers"
          label="Manage Customers"
          icon={<Users className="w-8 h-8" />}
        />
        <QuickLink
          to="/products"
          label="Browse Products"
          icon={<Gem className="w-8 h-8" />}
        />
        <QuickLink
          to="/bookings"
          label="View Bookings"
          icon={<Calendar className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
