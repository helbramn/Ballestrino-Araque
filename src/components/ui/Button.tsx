import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    href,
    type = 'button',
    className = '',
    disabled = false,
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full font-semibold transition-all';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim();

    if (href) {
        return (
            <a
                href={href}
                className={classes}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={!disabled ? onClick : undefined}
            className={classes}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
