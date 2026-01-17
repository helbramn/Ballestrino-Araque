import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
    images: string[];
    isOpen: boolean;
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
    images,
    isOpen,
    currentIndex,
    onClose,
    onNext,
    onPrev,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight') {
                onNext();
            } else if (e.key === 'ArrowLeft') {
                onPrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Prevent body scroll when lightbox is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, onNext, onPrev]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Close Button - Enhanced Visibility */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[10000] p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm group"
                aria-label="Cerrar"
            >
                <X className="w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                    className="absolute left-4 z-[10000] p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Imagen anterior"
                >
                    <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                </button>
            )}

            {/* Image */}
            <div
                className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={images[currentIndex]}
                    alt={`Imagen ${currentIndex + 1} de ${images.length}`}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    className="absolute right-4 z-[10000] p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Imagen siguiente"
                >
                    <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                </button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2 bg-black/50 text-white rounded-full text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>,
        document.body
    );
};
