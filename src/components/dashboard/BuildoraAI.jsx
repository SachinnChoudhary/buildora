import React, { useState } from 'react';

const BuildoraAI = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'How do I implement liveness detection with OpenCV?' },
        { role: 'user', text: "Great question! Here's a 3-step approach using blink detection..." }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput('');
        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: "I'm processing your request. As an AI assistant, I can help you with code snippets, debugging, and project documentation!" }]);
        }, 1000);
    };

    return (
        <div className="dash-card ai-card">
            <div className="ai-card-glow"></div>
            <div className="dash-card-header">
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>🤖 BuildoraAI</h2>
            </div>
            <div className="ai-chat-preview">
                {messages.map((msg, i) => (
                    <div key={i} className={`ai-msg ${msg.role}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="ai-input-wrapper">
                <input 
                    type="text" 
                    placeholder="Ask BuildoraAI..." 
                    className="ai-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="ai-send-btn" onClick={handleSend}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        </div>
    );
};

export default BuildoraAI;
