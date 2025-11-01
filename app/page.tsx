"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRODUCTS } from '../constants';
import { ProductsIcon, CustomersIcon, BookingsIcon } from '../components/Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: string }> = ({ icon, title, children }) => (
    <div className="flex flex-col items-center text-center p-6">
        <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-secondary text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return <div className="flex h-screen w-full items-center justify-center bg-background">Loading...</div>;
    }

    const showcaseProducts = MOCK_PRODUCTS.slice(0, 4);

    return (
        <div className="bg-background text-text-main font-sans antialiased">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white tracking-wider">AstroGems</h1>
                    <Link href="/login" className="px-5 py-2 bg-accent text-white font-semibold rounded-full hover:bg-orange-500 transition-colors shadow-lg">
                        Astrologer Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center text-white bg-primary overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-primary opacity-60"></div>
                </div>
                <div className="text-center z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                        Empower Your Astrological Practice
                    </h1>
                    <p className="text-lg md:text-xl text-purple-200 max-w-3xl mx-auto mb-8">
                        The exclusive B2B marketplace for modern astrologers. Access authentic gemstones, manage client orders, and elevate your craft.
                    </p>
                    <Link href="/login" className="inline-block px-10 py-4 bg-accent text-white text-lg font-bold rounded-full hover:bg-orange-500 transition-transform transform hover:scale-105 shadow-2xl">
                        Begin Your Journey
                    </Link>
                </div>
            </section>
            
            {/* How It Works Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto text-center px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">A Universe of Possibilities</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12 sm:mb-16">
                        Our platform is designed to seamlessly integrate with your astrological services, providing you with the tools you need to succeed.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                       <FeatureCard icon={<ProductsIcon className="w-8 h-8"/>} title="Browse & Select">
                           Explore our vast catalog of high-quality, ethically sourced crystals, gemstones, and jewelry at exclusive B2B prices.
                       </FeatureCard>
                       <FeatureCard icon={<BookingsIcon className="w-8 h-8"/>} title="Place Orders">
                           Create bookings for your clients with flexible pricing or purchase items for your personal practice with ease.
                       </FeatureCard>
                       <FeatureCard icon={<CustomersIcon className="w-8 h-8"/>} title="Manage & Track">
                           Effortlessly manage your customer database, track booking statuses, and view your sales performance from one dashboard.
                       </FeatureCard>
                    </div>
                </div>
            </section>
            
            {/* Product Showcase */}
            <section className="py-16 sm:py-24 bg-secondary">
                <div className="container mx-auto text-center px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Curated for Your Craft</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12 sm:mb-16">
                        Discover products selected for their energetic properties and quality, perfect for recommendations and remedies.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {showcaseProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-32 sm:h-48 object-cover"/>
                                <div className="p-4">
                                    <h3 className="font-semibold text-sm sm:text-base text-text-main truncate">{product.name}</h3>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Call to Action */}
            <section className="py-16 sm:py-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Ready to Align with the Cosmos?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Join our exclusive community of astrologers and gain access to the tools that will make your practice shine.
                    </p>
                    <Link href="/login" className="inline-block px-10 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary-focus transition-transform transform hover:scale-105 shadow-xl">
                        Access Your Portal
                    </Link>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-primary text-purple-200 py-6">
                <div className="container mx-auto text-center px-4">
                    <p>&copy; {new Date().getFullYear()} AstroGems. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
