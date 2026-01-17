import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Upload size={24} />
                                </div>
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={() => setSelectedFile(null)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium mt-2"
                                >
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Upload size={24} />
                                </div>
                                <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500">PDF, DOCX, or Images (max 10MB)</p>
                            </div>
                        )}

                        <input
                            type="file"
                            className="hidden"
                            onChange={handleChange}
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                        {!selectedFile && (
                            <label
                                htmlFor="file-upload"
                                className="absolute inset-0 cursor-pointer"
                            />
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={!selectedFile} onClick={handleSubmit}>
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
};
