"use client";

import React from "react";

interface Props {
  activeTab: string;
  onChange: (tab: "products" | "orders" | "customers") => void;
}

export default function AdminHeader({ activeTab, onChange }: Props) {
  const tabs = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "customers", label: "Customers" },
  ];

  return (
    <div className="w-full border-b bg-stone-50 rounded-lg mb-6 p-3 flex justify-center gap-4">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id as any)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            activeTab === t.id
              ? "bg-stone-800 text-white shadow"
              : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
