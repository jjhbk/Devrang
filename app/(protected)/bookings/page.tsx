"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

const BookingDetailsModal: React.FC<{
  order: any;
  onClose: () => void;
}> = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Order Details (ID: {order.order_id})
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
        <div>
          <strong>Customer:</strong> {order.customer?.name || "Unknown"}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Total:</strong>{" "}
          <span className="font-bold text-lg text-primary">
            ₹{order.amount.toFixed(2)}
          </span>
        </div>
      </div>

      <h3 className="font-semibold mb-2 text-gray-800">Items:</h3>
      <ul className="border-t border-b divide-y mb-4">
        {order.items?.map((item: any, idx: number) => (
          <li key={idx} className="flex justify-between py-2 text-gray-700">
            <div className="flex items-center gap-3">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
              )}
              <span>
                {item.name} ×{item.quantity}
              </span>
            </div>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const BookingsPage: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders for logged-in user
  const fetchOrders = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) fetchOrders(session.user.email);
  }, [session]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === "All") return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "captured":
        return "bg-green-100 text-green-800";
      case "created":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {selectedOrder && (
        <BookingDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-4">
          <span>Filter by status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="created">Created</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center p-6 text-gray-500">No orders found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-800">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.order_id}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.items
                      ?.slice(0, 2)
                      .map((i: any) => i.name)
                      .join(", ")}
                    {order.items?.length > 2 && (
                      <span className="text-gray-400">
                        {" "}
                        +{order.items.length - 2} more
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
