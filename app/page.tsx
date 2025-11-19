"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { MOCK_PRODUCTS } from "../constants";
import SignInPopup from "../components/SignInPopup";
import { Gem, ShieldCheck, Sparkles, Sun, User, ShoppingBag } from "lucide-react";

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: string; }> = ({ icon, title, children }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all border border-orange-100">
    <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-orange-100 text-orange-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-red-900 mb-2">{title}</h3>
    <p className="text-stone-600">{children}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const showcaseProducts = MOCK_PRODUCTS ? MOCK_PRODUCTS.slice(0, 4) : [];

  const handleGoogleSignIn = () => {
    signIn("google", { redirect: false });
  };

  return (
    <div className="bg-[#FFF5E6] text-[#4A2C2A] font-sans antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#FFF5E6]/90 backdrop-blur-md border-b border-orange-200 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Sun className="w-8 h-8 text-orange-500 animate-spin-slow" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-red-900 uppercase">
              Devrang
            </h1>
          </div>

          {/* Action Button */}
          {status === "authenticated" ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition-all"
            >
              <User className="w-4 h-4" />
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => setShowPopup(true)}
              className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-red-800 text-white font-semibold shadow-md hover:bg-red-900 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Astrologer </span>Login
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-orange-100 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#FF9933 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="inline-block p-2 px-4 mb-6 rounded-full bg-orange-200/50 border border-orange-300 text-orange-800 font-medium text-sm">
            ✨ Exclusive B2B Marketplace for Astrologers
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-red-900 leading-tight">
            Authentic Gems <br />
            <span className="text-orange-600">Divine Connection</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Source premium, energized gemstones and spiritual tools directly for your practice. 
            Connect your clients with the cosmic energy they need.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => status === "authenticated" ? router.push("/dashboard") : setShowPopup(true)}
              className="px-8 py-4 bg-orange-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Explore Collection
            </button>
            <button className="px-8 py-4 bg-white text-red-900 border border-red-200 text-lg font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-transform hover:-translate-y-1 w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Decorative Separator */}
      <div className="thoranam-border w-full"></div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-red-900 mb-4">Why Choose Devrang?</h2>
            <p className="text-stone-500 max-w-xl mx-auto">We understand the sanctity of your practice. Our products are curated with purity and tradition in mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gem className="w-8 h-8" />}
              title="Certified Authenticity"
            >
              Every gemstone is lab-tested and certified for authenticity, ensuring you get exactly what you see.
            </FeatureCard>
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Energized & Pure"
            >
              Sourced from sacred locations and handled with care to maintain their spiritual potency for your remedies.
            </FeatureCard>
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Trusted by Experts"
            >
              The preferred marketplace for professional astrologers across India. Wholesale pricing for your business.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Decorative Separator Green */}
      <div className="thoranam-border-green w-full"></div>

      {/* Products Preview */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-6">
           <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-red-900 mb-2">Featured Collection</h2>
              <p className="text-stone-500">Handpicked for powerful planetary alignment.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700">
              View All <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {showcaseProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-orange-100"
              >
                <div className="relative h-64 overflow-hidden bg-stone-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-1">{product.type}</div>
                  <h3 className="font-bold text-lg text-red-900 mb-2 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-stone-800">₹{product.price}</span>
                    <button className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors">
                       <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
             <button className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700">
              View All <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-orange-100">Join the Devrang Community</h2>
          <p className="text-orange-200 text-lg max-w-2xl mx-auto mb-10">
            Empower your astrological practice with our premium tools and resources. Sign up today to access exclusive wholesale prices.
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="px-10 py-4 bg-white text-red-900 font-bold rounded-full shadow-xl hover:bg-orange-50 transition-transform transform hover:scale-105"
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3E2723] text-orange-200 py-12 border-t-4 border-orange-500">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="mb-6 md:mb-0 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Devrang</h3>
                <p className="text-sm opacity-70">Connecting the cosmos to your clients.</p>
             </div>
             <div className="flex gap-8 text-sm font-medium">
                <a href="#" className="hover:text-white transition-colors">About Us</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
             </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10 text-center text-xs opacity-50">
            &copy; {new Date().getFullYear()} Devrang. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sign-In Popup */}
      <SignInPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
};

export default LandingPage;