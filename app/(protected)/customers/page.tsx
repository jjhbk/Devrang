"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Customer } from "../../../types";
import CustomerFormModal from "@/components/CustomersPage";

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load customers
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // ✅ Create / Update
  const handleSaveCustomer = async (data: Customer | Omit<Customer, "_id">) => {
    try {
      if ("_id" in data) {
        await fetch("/api/customers/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: data._id, ...data }),
        });
      } else {
        await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      await loadCustomers();
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (err) {
      console.error("❌ Save error:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch("/api/customers/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadCustomers();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      ),
    [customers, searchTerm]
  );

  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <CustomerFormModal
          customer={editingCustomer}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold text-amber-900">Manage Customers</h1>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 shadow-sm transition-colors"
        >
          Add New Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-x-auto">
        {loading ? (
          <p className="text-center p-6 text-stone-500">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center p-6 text-stone-500">No customers found.</p>
        ) : (
          <table className="w-full whitespace-nowrap">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr className="text-left text-stone-600 font-serif">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.map((c) => (
                <tr key={c._id} className="hover:bg-stone-50/50">
                  <td className="px-6 py-4 text-stone-800">{c.name}</td>
                  <td className="px-6 py-4 text-stone-600">{c.phone}</td>
                  <td className="px-6 py-4 text-stone-600">{c.email || "N/A"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingCustomer(c);
                        setIsModalOpen(true);
                      }}
                      className="text-amber-700 hover:underline mr-4 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id!)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
