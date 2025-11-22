"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product, onAddToCart }) {
  const router = useRouter();

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover bg-stone-100"
      />

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-medium text-stone-900">{product.name}</h3>

        <p className="text-sm text-stone-500">{product.brand}</p>
        <p className="text-sm text-stone-500 italic">
          {product.category} • {product.recipient || "Any"}
        </p>

        <p className="text-sm text-stone-600 line-clamp-2">{product.story}</p>

        <p className="text-xl font-semibold text-amber-900 mt-1">
          ₹{product.price.toFixed(2)}
        </p>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => router.push(`/product/${product._id}`)}
            className="px-3 py-1 text-sm bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition"
          >
            View Details
          </button>

          <button
            onClick={() => onAddToCart(product, 1)}
            className="px-4 py-1.5 text-sm rounded-md bg-amber-900 text-white hover:bg-amber-800 hover:scale-105 active:scale-95 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
