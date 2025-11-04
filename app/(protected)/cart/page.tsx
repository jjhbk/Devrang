"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Customer } from "../../../types";
import { TrashIcon } from "../../../components/Icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartPage: React.FC = () => {
  const { data: session } = useSession();
  const { cart, updateCartItem, removeFromCart, customers, clearCart } =
    useAppContext();

  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | "self" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const router = useRouter();

  // ✅ Compute total
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (t, i) => t + (i.customPrice || i.product.price) * i.quantity,
        0
      ),
    [cart]
  );

  // ✅ Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Checkout handler
  const handleCheckout = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer or 'Self-booking' first.");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    const items = cart.map((i) => ({
      name: i.product.name,
      price: i.customPrice || i.product.price,
      quantity: i.quantity,
      imageUrl: i.product.imageUrl,
      brand: i.product.brand,
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ✅ Use current logged-in user for self checkout
    const customer =
      selectedCustomer === "self"
        ? {
            name: session?.user?.name || "Unknown User",
            email: session?.user?.email || "unknown@astrogems.com",
            phone: (session as any)?.user?.phone || "N/A",
            address: (session as any)?.user?.address || "N/A",
          }
        : {
            name: selectedCustomer.name,
            email: selectedCustomer.email || "unknown@astrogems.com",
            phone: selectedCustomer.phone,
            address: selectedCustomer.shippingAddress || "",
          };

    try {
      setIsProcessing(true);

      // ✅ Create order / payment link
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer,
          totalAmount,
          isSelf: selectedCustomer === "self",
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Razorpay API error:", errText);
        alert("Failed to create Razorpay order or payment link.");
        setIsProcessing(false);
        return;
      }

      const data = await res.json();

      // ✅ FLOW 1: Self booking → Open Razorpay Checkout
      if (selectedCustomer === "self") {
        const order = data.order;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          name: "AstroGems",
          description: `Order for ${items.length} item(s)`,
          order_id: order.id,
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          theme: { color: "#8B5CF6" },
          handler: async (response: any) => {
            try {
              const verify = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...response,
                  items,
                  customer,
                }),
              });

              const verifyData = await verify.json();
              if (verifyData.status === "ok") {
                clearCart();
                setConfirmation({
                  type: "self",
                  paymentId: response.razorpay_payment_id,
                  orderId: order.id,
                  items,
                  customer,
                  total: totalAmount,
                });
              } else {
                alert("Payment verification failed.");
              }
            } catch (verifyErr) {
              console.error("Payment verify error:", verifyErr);
              alert("Error verifying payment.");
            } finally {
              setIsProcessing(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      // ✅ FLOW 2: Customer booking → Generate & show payment link
      else {
        clearCart();
        setConfirmation({
          type: "link",
          paymentLink: data.paymentLink,
          orderId: data.orderId,
          customer,
          items,
          total: totalAmount,
        });
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Unable to start checkout. Try again.");
      setIsProcessing(false);
    }
  };

  // ✅ Confirmation screens
  if (confirmation) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {confirmation.type === "self" ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Payment Successful 🎉
            </h1>
            <p className="text-gray-700 mb-2">
              Order ID: {confirmation.orderId}
            </p>
            <p className="text-gray-700 mb-2">
              Payment ID: {confirmation.paymentId}
            </p>
            <p className="text-gray-700 mb-4">
              Customer: <strong>{confirmation.customer.name}</strong>
            </p>
            <p className="text-lg font-semibold">
              Total: ₹{confirmation.total.toFixed(2)}
            </p>
            <button
              onClick={() => router.push("/bookings")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View My Orders
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-amber-600 mb-4">
              Payment Link Generated 🔗
            </h1>
            <p className="text-gray-700 mb-2">
              Order ID: {confirmation.orderId}
            </p>
            <p className="text-gray-700 mb-4">
              Share this link with <strong>{confirmation.customer.name}</strong>
            </p>
            <input
              readOnly
              value={confirmation.paymentLink}
              className="w-full max-w-md p-2 border rounded-md bg-gray-100 text-center"
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(confirmation.paymentLink)
              }
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Copy Payment Link
            </button>
            <button
              onClick={() => router.push("/bookings")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Orders
            </button>
          </>
        )}
      </div>
    );
  }

  // ✅ Main Checkout UI
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-6">
        Checkout / New Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🛒 Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            {cart.length === 0 ? (
              <p>
                Your cart is empty.{" "}
                <button
                  onClick={() => router.push("/products")}
                  className="text-blue-600 hover:underline"
                >
                  Add products
                </button>
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 border-b py-4"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.product.price}
                    </p>
                  </div>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartItem(
                        item.product.id as string,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-16 p-2 border rounded-md"
                  />
                  <button
                    onClick={() => removeFromCart(item.product.id as string)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 💰 Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <select
              onChange={(e) =>
                setSelectedCustomer(
                  e.target.value === "self"
                    ? "self"
                    : customers.find((c) => c._id === e.target.value) || null
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="">-- Select Customer --</option>
              <option value="self">Self-booking</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - {c.phone}
                </option>
              ))}
            </select>

            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0 || !selectedCustomer}
              className={`w-full py-3 rounded-md font-semibold ${
                isProcessing || cart.length === 0 || !selectedCustomer
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              }`}
            >
              {isProcessing
                ? "Processing..."
                : selectedCustomer === "self"
                ? "Proceed to Pay"
                : "Generate Payment Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
