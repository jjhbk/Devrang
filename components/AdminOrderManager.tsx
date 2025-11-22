"use client";

import React, { useEffect, useState } from "react";

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Paid";

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  brand: string;
}

export interface Order {
  order_id: string; // replaces id
  items: OrderItem[]; // replaces product
  customer: CheckoutCustomer;
  payment_id: string; // replaces paymentId
  createdAt: string; // replaces date
  status: OrderStatus;
  trackingNumber?: string;
}

export default function AdminOrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders/get");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch("/api/orders/updateStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // Update tracking number
  const handleTrackingUpdate = async (id: string, trackingNumber: string) => {
    try {
      const res = await fetch("/api/orders/updateTracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, trackingNumber }),
      });

      if (!res.ok) throw new Error("Failed to update tracking number");

      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("Error updating tracking number");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading orders...</p>;
  if (error) return <p className="text-red-600 text-center p-6">{error}</p>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-serif text-amber-900 mb-4 text-center">
        Orders Management
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-stone-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const item = order.items[0]; // since each order has items array
            return (
              <div
                key={order.order_id}
                className="border border-stone-300 rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl}
                    className="w-24 h-24 object-cover rounded-md"
                    alt={item.name}
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-stone-500">₹{item.price}</p>
                    <p className="text-xs text-stone-400">
                      Ordered: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-stone-500">
                    {order.customer.email}
                  </p>
                  <p className="text-sm text-stone-500">
                    Payment ID: {order.payment_id}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm">
                    <strong>Status:</strong> {order.status}
                  </p>

                  <div className="flex gap-2 mt-2">
                    {(
                      [
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Paid",
                      ] as OrderStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusUpdate(order.order_id, st)}
                        className={`px-2 py-1 text-xs rounded-md border ${
                          order.status === st
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <input
                      type="text"
                      defaultValue={order.trackingNumber || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTrackingUpdate(
                            order.order_id,
                            e.currentTarget.value
                          );
                        }
                      }}
                      placeholder="Tracking Number"
                      className="w-full border p-2 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
