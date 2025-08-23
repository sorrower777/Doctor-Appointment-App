import React, {useState, useEffect} from "react";
import {io} from "socket.io-client";

const socket = io("http://localhost:4000");

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => socket.off('receive_message');
    }, []);
    const sendMessage = () => {
        if(message.trim() != '') {
            socket.emit('send_message', {text: message});
            setMessage('');
        }
    };

    return (
        <div className="border rounded-lg p-4 w-80 bg-white shadow">
            <h3 className="text-lg font-semibold mb-2">Chat</h3>
            <div className="h-40 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
                {messages.map((msg, idx) => (
                    <div key={idx} className="mb-1 text-gray-700">{msg.text}</div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 border rounded-l px-2 py-1 focus:outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;