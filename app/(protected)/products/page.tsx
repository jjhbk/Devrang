"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product } from "../../../types";
import { useAppContext } from "../../../context/AppContext";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCardSales"; // ensure this path is correct

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const { addToCart } = useAppContext();
  const [notification, setNotification] = useState("");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products/get", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error("❌ Error loading products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique types
  const productTypes = useMemo(() => {
    if (!products.length) return ["All"];
    return ["All", ...Array.from(new Set(products.map((p) => p.type)))];
  }, [products]);

  // Add to cart handler
  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  // Search + Filter + Sort
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.use?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "All" || product.type === filterType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, searchTerm, filterType, sortOrder]);

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-medium">
          {notification}
        </div>
      )}

      <h1 className="text-3xl font-serif font-bold text-amber-900 mb-6">
        Product Marketplace
      </h1>

      {/* Search + Filters */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg border border-stone-200 shadow-sm mb-8 flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or use..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 text-stone-800"
          />
        </div>

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-stone-300 rounded-md text-stone-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          {productTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-stone-300 rounded-md text-stone-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="name-asc">Sort by Name (A–Z)</option>
          <option value="name-desc">Sort by Name (Z–A)</option>
          <option value="price-asc">Sort by Price (Low–High)</option>
          <option value="price-desc">Sort by Price (High–Low)</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-stone-500">
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-10">{error}</div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center text-stone-500 py-10">
          No products match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id ? product.id.toString() : product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
