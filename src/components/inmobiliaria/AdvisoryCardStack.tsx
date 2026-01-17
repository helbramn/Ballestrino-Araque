import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { TrendingUp, Users, Home, ArrowRight } from 'lucide-react';

interface AdvisoryCard {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    link?: string;
}

const cards: AdvisoryCard[] = [
    {
        id: 1,
        title: "Inversión Rural",
        description: "Oportunidades únicas de alta rentabilidad en la sierra de Segovia.",
        icon: <TrendingUp className="w-6 h-6 text-white" />,
        color: "bg-[#556B2F]", // Dark Olive Green
        link: "/inversores"
    },
    {
        id: 2,
        title: "Asesoría Integral",
        description: "Te guiamos en cada paso de la compra o venta de tu propiedad.",
        icon: <Users className="w-6 h-6 text-white" />,
        color: "bg-[#8B4513]" // Saddle Brown
    },
    {
        id: 3,
        title: "Personal Shopper",
        description: "Buscamos por ti la casa de tus sueños, ahorrándote tiempo.",
        icon: <Home className="w-6 h-6 text-white" />,
        color: "bg-[#A0522D]" // Sienna
    }
];

export const AdvisoryCardStack: React.FC = () => {
    const [cardsState, setCardsState] = useState(cards);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const moveCardToBack = (e: React.MouseEvent) => {
        // Prevent card rotation if clicking a button/link
        if ((e.target as HTMLElement).closest('button')) return;

        if (isAnimating) return;
        // Start animation
        setIsAnimating(true);

        // Wait for animation to complete before swapping data
        setTimeout(() => {
            setCardsState((prev) => {
                const newCards = [...prev];
                const first = newCards.shift();
                if (first) newCards.push(first);
                return newCards;
            });
            setIsAnimating(false);
        }, 600); // Match CSS transition duration
    };

    // Auto-rotation every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Only rotate if not hovering (optional, but good UX) - for now just rotate
            // We can't easily access the click handler here without refactoring, 
            // so we'll just replicate the state update logic or call a ref.
            // For simplicity, let's just update state directly as before.
            setCardsState((prev) => {
                const newCards = [...prev];
                const first = newCards.shift();
                if (first) newCards.push(first);
                return newCards;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[280px] mx-auto h-[180px] md:h-[200px] perspective-1000 group cursor-pointer select-none" onClick={moveCardToBack}>
            {cardsState.map((card, index) => {
                const isTop = index === 0;
                const isMiddle = index === 1;
                const isBottom = index === 2;

                let transform = '';
                let zIndex = 0;
                let opacity = 1;

                if (isTop) {
                    if (isAnimating) {
                        transform = 'rotate(0deg) translateY(40px) translateX(0) scale(0.9)';
                        zIndex = 0;
                        opacity = 0.5;
                    } else {
                        transform = 'rotate(0deg) translateY(0) translateX(0) scale(1)';
                        zIndex = 30;
                        opacity = 1;
                    }
                } else if (isMiddle) {
                    transform = 'rotate(3deg) translateY(10px) translateX(10px) scale(0.98)';
                    zIndex = 20;
                    opacity = 1;
                } else if (isBottom) {
                    transform = 'rotate(6deg) translateY(20px) translateX(20px) scale(0.96)';
                    zIndex = 10;
                    opacity = 1;
                }

                return (
                    <div
                        key={card.id}
                        className="absolute inset-0 transition-all duration-700 ease-in-out"
                        style={{
                            transform,
                            zIndex,
                            opacity,
                            transformOrigin: 'bottom right'
                        }}
                    >
                        <Card className={`h-full flex flex-col justify-center p-5 border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-white ${card.color} rounded-3xl`}>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="bg-white/20 p-3 rounded-2xl shrink-0 shadow-inner">
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif mb-1 font-bold tracking-tight text-white">{card.title}</h3>
                                </div>
                            </div>
                            <p className="text-white/90 leading-snug text-xs font-medium opacity-90 mb-3">
                                {card.description}
                            </p>
                            {card.link && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(card.link!);
                                    }}
                                    className="self-start mt-auto flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Ver más <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                        </Card>
                    </div>
                );
            })}
        </div>
    );
};
