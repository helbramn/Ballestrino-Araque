import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'accent';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    const variantClasses = {
        default: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
        accent: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
};
