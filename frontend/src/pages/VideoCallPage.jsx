import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

// Initialize socket outside component to avoid multiple connections
const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''));

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
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="absolute top-8 left-8 z-20">
                <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">📡</div>
                    <div>
                        <h1 className="text-white font-black text-sm uppercase tracking-tighter">Secure Consultation</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Encrpyted • Room: {roomId.substring(0, 8)}...</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center justify-center h-full pt-16">
                <div className="flex flex-col lg:flex-row gap-8 w-full items-center justify-center">

                    {/* Remote User Video (Main View) */}
                    <div className="relative bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl w-full lg:w-2/3 aspect-video border-[6px] border-white/5 ring-1 ring-white/10 flex items-center justify-center group">
                        {callActive ? (
                            <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 mx-auto border border-white/5 relative">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                                    <span className="text-5xl relative">👨‍⚕️</span>
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Awaiting Connection...</p>
                            </div>
                        )}
                        {callActive && (
                            <div className="absolute bottom-6 left-6 flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span>Dr. Sarah (Consultant)</span>
                            </div>
                        )}
                    </div>

                    {/* Local Video (Floating or Side View) */}
                    <div className="relative bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm lg:w-1/3 aspect-video border-[4px] border-white/10 ring-1 ring-white/5 group">
                        <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover scale-x-[-1]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/5">You</div>

                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur shadow-lg flex items-center justify-center text-xs hover:bg-white/20 transition-colors">🔄</button>
                        </div>
                    </div>

                </div>

                {/* Integrated Controls Bar */}
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-30">
                    <div className="flex items-center gap-6 bg-slate-900/40 backdrop-blur-2xl border border-white/10 px-10 py-5 rounded-[32px] shadow-2xl ring-1 ring-white/5">

                        {incomingCall && !callActive && (
                            <div className="flex gap-4 mr-6 border-r border-white/10 pr-6 items-center">
                                <div className="text-left">
                                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Alert</p>
                                    <p className="text-white text-sm font-bold">Incoming WebCall...</p>
                                </div>
                                <button onClick={answerCall} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                                    Connect
                                </button>
                            </div>
                        )}

                        {!callActive && !incomingCall && (
                            <button
                                onClick={startCall}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all border border-indigo-400 hover:border-indigo-300 active:scale-95 mr-4"
                            >
                                Initiate Link
                            </button>
                        )}

                        <div className="flex gap-4">
                            {[
                                { icon: '🎤', label: 'Mute', onClick: () => toast.success("Audio Muted") },
                                { icon: '📹', label: 'Video', onClick: () => toast.success("Video Toggled") },
                                { icon: '🖥️', label: 'Share', onClick: () => toast.success("Screen Share Started") }
                            ].map((ctrl) => (
                                <button
                                    key={ctrl.label}
                                    onClick={ctrl.onClick}
                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                                    title={ctrl.label}
                                >
                                    <span className="text-xl">{ctrl.icon}</span>
                                </button>
                            ))}
                        </div>

                        <div className="w-px h-8 bg-white/10 mx-2"></div>

                        <button
                            onClick={endCall}
                            className="bg-rose-600/10 hover:bg-rose-600 border border-rose-500/30 text-rose-500 hover:text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-rose-600/30 active:scale-95"
                        >
                            Terminate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCallPage;
