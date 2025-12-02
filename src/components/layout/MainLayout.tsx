import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChatbotFloatingButton } from '../inmobiliaria/ChatbotFloatingButton';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <ChatbotFloatingButton />
        </div>
    );
};
