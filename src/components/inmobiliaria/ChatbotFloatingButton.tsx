import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Bot, X } from 'lucide-react';

export const ChatbotFloatingButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="bg-white p-4 rounded-[var(--radius-lg)] shadow-xl border border-[var(--color-border)] max-w-xs animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-bold text-sm">Asistente Virtual</h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-[var(--color-text-light)]">
                        ¡Nuestro agente especial aún no ha sido contratado! 🤖
                    </p>
                </div>
            )}

            <Button
                className="h-12 px-6 rounded-full shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300 bg-[var(--color-primary)] text-white"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chatbot"
            >
                <Bot className="w-6 h-6" />
            </Button>
        </div>
    );
};
