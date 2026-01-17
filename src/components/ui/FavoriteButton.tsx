import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';

interface FavoriteButtonProps {
    propertyId: string;
    className?: string;
    size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ propertyId, className = '', size = 20 }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const active = isFavorite(propertyId);

    return (
        <button
            onClick={(e) => toggleFavorite(propertyId, e)}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${active
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white'
                } ${className}`}
            title={active ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
            <Heart
                size={size}
                className={`transition-all duration-300 ${active ? 'fill-current' : ''}`}
            />
        </button>
    );
};
