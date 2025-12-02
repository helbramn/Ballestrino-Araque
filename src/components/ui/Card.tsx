import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
    const hoverClasses = hover ? 'hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300' : '';

    return (
        <div className={`card-rustic ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};
