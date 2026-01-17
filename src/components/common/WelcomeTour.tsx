import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface TourStep {
    title: string;
    description: string;
    target?: string;
}

const steps: TourStep[] = [
    {
        title: "Welcome to Nexus!",
        description: "Your all-in-one platform for connecting with investors and managing your startup journey.",
    },
    {
        title: "New: Wallet",
        description: "Manage your funds, view transactions, and handle upcoming deal payouts in the new Wallet section.",
    },
    {
        title: "New: Document Chamber",
        description: "Upload pitch decks and legal documents. Now with e-signature capabilities!",
    },
    {
        title: "Video Calling",
        description: "Connect directly with investors using our new integrated video call feature in Messages.",
    },
];

export const WelcomeTour: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check if tour has been shown before
        const hasSeenTour = localStorage.getItem('nexus_tour_seen');
        if (!hasSeenTour) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('nexus_tour_seen', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-4 sm:p-0">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={handleClose} />

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto relative transform transition-all animate-bounce-in p-6 z-50 m-4">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                        {currentStep + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {steps[currentStep].title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        {steps[currentStep].description}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    <Button onClick={handleNext} rightIcon={currentStep === steps.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}>
                        {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
