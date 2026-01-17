import React from 'react';
import { PropertyFinderWizard } from '../components/inmobiliaria/PropertyFinderWizard';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { SEOHeaders } from '../components/seo/SEOHeaders';

export const QuizPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F5F5F0] flex flex-col">
            <SEOHeaders title="Buscador Inteligente" />
            {/* Minimal Header */}
            <div className="p-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
                    Ballestrino <span className="text-[var(--color-primary)]">Araque</span>
                </Link>
                <Link to="/" className="p-2 rounded-full hover:bg-black/5 transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <PropertyFinderWizard />
            </div>
        </div>
    );
};
