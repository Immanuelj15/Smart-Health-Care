import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

// Initialize socket outside component to avoid multiple connections
const socket = io('http://localhost:5000');

const VideoCallPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [callActive, setCallActive] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        // 1. Get User Media (Camera/Mic)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.error("Failed to get media:", err);
                toast.error("Could not access camera/microphone. Please check permissions.");
            });

        // 2. Socket Event Listeners
        socket.on('connect', () => {
            setMe(socket.id);
            console.log("Connected with ID:", socket.id);
            // Only join if we have a room
            if (roomId) {
                socket.emit("join_room", roomId);
            }
        });

        socket.on("incoming_call", (data) => {
            setIncomingCall(data);
        });

        socket.on("call_accepted", (data) => {
            setCallActive(true);
            // Here we would finalize the WebRTC connection logic
            toast.success("Call Connected!");
        });

        // Cleanup
        return () => {
            socket.off('connect');
            socket.off('incoming_call');
            socket.off('call_accepted');
        };
    }, [roomId]);

    // --- Handlers ---
    const answerCall = () => {
        setCallActive(true);
        setIncomingCall(null);
        // Emit signal to sender
        socket.emit("answer_call", { room: roomId });
    };

    const startCall = () => {
        // Notify others in room
        socket.emit("call_user", { room: roomId, from: me });
        toast("Calling...", { icon: '📞' });
    };

    const endCall = () => {
        setCallActive(false);
        navigate('/dashboard');
        // Stop tracks
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        window.location.reload(); // Simple way to clean up socket/peer states
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 left-4 text-white">
                <h1 className="text-xl font-bold">Telemedicine Consultation</h1>
                <p className="text-sm opacity-75">Room ID: {roomId}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl items-center justify-center">

                {/* My Video */}
                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl w-full md:w-1/2 aspect-video border-2 border-gray-800">
                    <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">You</div>
                </div>

                {/* User Video (Placeholder if not connected) */}
                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl w-full md:w-1/2 aspect-video border-2 border-gray-800 flex items-center justify-center">
                    {callActive ? (
                        <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                                <span className="text-4xl">👤</span>
                            </div>
                            <p>Waiting for other party...</p>
                        </div>
                    )}
                    {callActive && (
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">Doctor</div>
                    )}
                </div>

            </div>

            {/* Controls */}
            <div className="mt-8 flex gap-6 bg-gray-800 px-8 py-4 rounded-full shadow-lg items-center">
                {incomingCall && !callActive && (
                    <div className="animate-pulse flex gap-4 mr-4 border-r border-gray-600 pr-4">
                        <p className="text-white font-semibold my-auto">Incoming Call...</p>
                        <button onClick={answerCall} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full">
                            Answer
                        </button>
                    </div>
                )}

                {!callActive && (
                    <button onClick={startCall} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold">
                        Start Call
                    </button>
                )}

                <button onClick={() => toast("Mute toggled")} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full">
                    🎤
                </button>
                <button onClick={() => toast("Video toggled")} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full">
                    📹
                </button>

                <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold">
                    End Call
                </button>
            </div>
        </div>
    );
};

export default VideoCallPage;
