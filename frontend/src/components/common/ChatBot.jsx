import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ChatBot = () => {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hello! I am Dr. Smart. How can I assist you today? 🩺' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    if (!isAuthenticated) return null; // Only show for logged-in users

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Pass last 5 messages for context
            const context = messages.slice(-5);

            const { data } = await axios.post('http://localhost:5000/api/ai/chat',
                { message: userMsg.text, context },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col pointer-events-auto mb-4 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-teal-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold">Dr. Smart AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-teal-700 p-1 rounded">✖</button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-500 text-xs p-2 rounded-lg animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 disabled:opacity-50 transition"
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button (Always visible) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-teal-600 hover:bg-teal-700 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95 group"
            >
                {isOpen ? (
                    <span className="text-2xl font-bold">⬇</span>
                ) : (
                    <span className="text-3xl relative">
                        🤖
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-teal-600"></span>
                    </span>
                )}
            </button>

        </div>
    );
};

export default ChatBot;
