import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupChat.css';
import Groupfetched from '../components/GroupChatGroupsFetched';

const GroupChat = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    
    useEffect(() => {
        if (!selectedGroup) return;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:5000/api/group/${selectedGroup._id}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setMessages(response.data.messages);
            } catch (err) {
                setError('Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedGroup]); 


    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
    
       
        const senderEmail = localStorage.getItem('email');  
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/group/${selectedGroup._id}/messages`,
                { 
                    content: newMessage, 
                    sender: senderEmail, 
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,  
                    },
                }
            );
    
            setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
            setNewMessage(''); 
        } catch (err) {
            setError('Failed to send message');
        }
    };
    
    return (
        <div className="group-chat-container">
            <div className="group-list">
                <Groupfetched onSelectGroup={setSelectedGroup} />
            </div>

            <div className="chat-window">
                {selectedGroup ? (
                    <>
                        <div className="chat-header">
                            <h3>{selectedGroup.name}</h3>
                        </div>
                        <div className="chat-messages">
                            {loading ? (
                                <div>Loading messages...</div>
                            ) : (
                                messages.map((message, index) => (
                                    <div key={index} className="chat-message">
                                        <strong>{message.sender}:</strong> {message.content}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                    </>
                ) : (
                    <div className="no-group-selected">
                        <h3>Select a group to start chatting</h3>
                    </div>
                )}
            </div>
        </div>
    );
};


export default GroupChat;
