"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return <div className="flex h-screen w-full items-center justify-center bg-background">Redirecting to login...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
