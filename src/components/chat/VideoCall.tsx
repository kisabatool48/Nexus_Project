import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff } from 'lucide-react';

interface VideoCallProps {
    partnerName: string;
    partnerImage?: string;
    onEndCall: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ partnerName, partnerImage, onEndCall }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
    const [elapsedTime, setElapsedTime] = useState(0);

    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Simulate connection delay
        const timer = setTimeout(() => {
            setCallStatus('connected');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Start timer when connected
        let interval: ReturnType<typeof setInterval>;
        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    useEffect(() => {
        // Request camera access for self-view
        const startVideo = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };

        if (!isVideoOff) {
            startVideo();
        } else {
            if (localVideoRef.current && localVideoRef.current.srcObject) {
                const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
                localVideoRef.current.srcObject = null;
            }
        }

        return () => {
            // Cleanup streams on unmount
            if (localVideoRef.current && localVideoRef.current.srcObject) {
                const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isVideoOff]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-lg font-semibold border-2 border-white">
                        {partnerImage ? (
                            <img src={partnerImage} alt={partnerName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            partnerName.charAt(0)
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{partnerName}</h3>
                        <p className="text-sm opacity-80">
                            {callStatus === 'connecting' ? 'Connecting...' : formatTime(elapsedTime)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Video Area (Partner Mock) */}
            <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
                {callStatus === 'connecting' ? (
                    <div className="text-white text-center">
                        <div className="animate-ping w-16 h-16 bg-primary-500 rounded-full mx-auto mb-4 opacity-75"></div>
                        <p className="text-lg">Calling {partnerName}...</p>
                    </div>
                ) : (
                    /* Mock Partner Video - Static Placeholder or generic video loop if we had one */
                    <div className="text-center">
                        <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4">
                            <span className="text-4xl text-white font-bold">{partnerName.charAt(0)}</span>
                        </div>
                        <p className="text-gray-400">Partner video would appear here</p>
                    </div>
                )}

                {/* Self View (Draggable-ish / Absolute positioned) */}
                {!isVideoOff && (
                    <div className="absolute bottom-24 right-4 w-32 h-48 bg-black rounded-lg border-2 border-white overflow-hidden shadow-lg">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-6 flex justify-center items-center space-x-6">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition-colors ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-4 rounded-full transition-colors ${isScreenSharing ? 'bg-primary-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                >
                    {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
                </button>

                <button
                    onClick={onEndCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};
