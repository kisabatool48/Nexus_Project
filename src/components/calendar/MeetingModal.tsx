import React, { useState } from 'react';

interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, start: Date, end: Date) => void;
    initialStart: Date;
    initialEnd: Date;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialStart,
    initialEnd,
}) => {
    const [title, setTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(title, initialStart, initialEnd);
        setTitle('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="card w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Schedule Meeting</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Meeting Title
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Project Sync"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-4 text-sm text-secondary-600">
                        <p><strong>Start:</strong> {initialStart.toLocaleString()}</p>
                        <p><strong>End:</strong> {initialEnd.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
