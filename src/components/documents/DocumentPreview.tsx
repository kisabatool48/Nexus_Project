import React, { useRef, useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface DocumentPreviewProps {
    document: {
        id: number;
        name: string;
        status?: 'Draft' | 'In Review' | 'Signed';
    };
    onClose: () => void;
    onSign: (id: number) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose, onSign }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000000';
            }
        }
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (document.status === 'Signed') return;

        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            setHasSignature(true);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
        }
    };

    const handleSign = () => {
        if (hasSignature) {
            onSign(document.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{document.name}</h3>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${document.status === 'Signed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {document.status || 'Draft'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Content (Mock Document Body) */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-3xl mx-auto bg-white shadow-sm p-12 min-h-full border border-gray-200 text-gray-800">
                        <h1 className="text-3xl font-bold mb-6 text-center">CONTRACT AGREEMENT</h1>
                        <p className="mb-4">
                            This Agreement is entered into as of <strong>{new Date().toLocaleDateString()}</strong>, by and between the parties involved.
                        </p>
                        <p className="mb-4">
                            <strong>1. TERMS.</strong> The involved parties agree to collaborate on the Nexus platform.
                            This document serves as a binding agreement for the investment/collaboration deal.
                        </p>
                        <p className="mb-4">
                            <strong>2. CONFIDENTIALITY.</strong> All shared information shall remain confidential.
                        </p>
                        <p className="mb-4">
                            <strong>3. GOVERNING LAW.</strong> This agreement shall be governed by the laws of the jurisdiction.
                        </p>

                        <div className="mt-16 border-t border-gray-300 pt-8">
                            <p className="mb-4 font-semibold">Signatures:</p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="h-40 border-b border-gray-400 mb-2 relative bg-gray-50">
                                        {/* Signature Area */}
                                        {document.status === 'Signed' ? (
                                            <div className="absolute inset-0 flex items-center justify-center text-green-600 font-script text-4xl transform -rotate-3 select-none">
                                                Signed Digitally
                                            </div>
                                        ) : (
                                            <canvas
                                                ref={canvasRef}
                                                width={300}
                                                height={160}
                                                className="w-full h-full cursor-crosshair touch-none"
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">Authorized Signature</p>
                                    {document.status !== 'Signed' && (
                                        <button
                                            onClick={clearSignature}
                                            className="text-xs text-red-500 mt-1 hover:underline"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <div className="h-40 border-b border-gray-400 mb-2 relative bg-gray-50 flex items-center justify-center">
                                        <span className="text-gray-400 italic">Party B Signature</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Counterparty Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    {document.status !== 'Signed' && (
                        <Button
                            onClick={handleSign}
                            disabled={!hasSignature}
                            leftIcon={<Check size={18} />}
                        >
                            Sign & Finalize
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
