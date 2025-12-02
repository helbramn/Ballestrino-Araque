import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Users, Home } from 'lucide-react';

interface AdvisoryCard {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const cards: AdvisoryCard[] = [
    {
        id: 1,
        title: "Inversión Rural",
        description: "Oportunidades únicas de alta rentabilidad en la sierra de Segovia.",
        icon: <TrendingUp className="w-6 h-6 text-white" />,
        color: "bg-[#556B2F]" // Dark Olive Green
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

    const moveCardToBack = () => {
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
            moveCardToBack();
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

                // Logic for "Send to Back" animation
                // When animating, the top card (index 0) moves down and fades out to simulate going to back
                // The others move up to take its place

                if (isTop) {
                    if (isAnimating) {
                        // Animation state: Top card moves down and shrinks to go behind
                        transform = 'rotate(0deg) translateY(40px) translateX(0) scale(0.9)';
                        zIndex = 0; // Drop z-index during animation so it appears to go behind
                        opacity = 0.5;
                    } else {
                        // Static state: Top card is front and center
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
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shrink-0 shadow-inner">
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif mb-1 font-bold tracking-tight text-white">{card.title}</h3>
                                    <p className="text-white/90 leading-snug text-xs font-medium opacity-90">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
};
