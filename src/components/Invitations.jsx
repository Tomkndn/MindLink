import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Invitations.css';

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const token = localStorage.getItem('token'); 
                if (!token) {
                    setError('No token found. Please log in.');
                    setLoading(false);
                    return;
                }
                const userEmail = localStorage.getItem('email'); 
    
                const response = await axios.post(
                    'http://localhost:5000/api/group/invites', 
                    { userEmail }, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                            'Content-Type': 'application/json', 
                        },
                    }
                );
                console.log(response.data);  
                if (response.status === 200) {
                    setInvitations(response.data.groups);
                } else {
                    setError('Failed to fetch invitations. Please try again.');
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch invitations:', err);
                setError('Failed to fetch invitations');
                setLoading(false);
            }
        };
    
        fetchInvitations();
    }, []);
    
    const handleAccept = async (groupId) => {
        console.log('Group ID received in handleAccept:', groupId); 
        if (!groupId) {
            console.error('Group ID is undefined');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }
    
            const response = await axios.post(
                'http://localhost:5000/api/group/invites/accept',
                {
                    userEmail: localStorage.getItem('email'),  
                    groupId: groupId,       
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data); 
            if (response.status === 200) {
                alert("Invite accepted successfully!");
            }
        } catch (error) {
            console.error("Error accepting invite:", error);
            alert("Failed to accept the invitation.");
        }
    };

    const handleReject = async (groupId) => {
        if (!groupId) {
            console.error('Group ID is undefined');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/group/invites/reject', 
                { userEmail: localStorage.getItem('email'), groupId }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {

                setInvitations((prevInvitations) =>
                    prevInvitations.filter((invite) => invite.groupId !== groupId)
                );
                alert('Invitation rejected!');
            } else {
                setError('Failed to reject invitation.');
            }
        } catch (err) {
            console.error('Error rejecting invite:', err);
            setError('Failed to reject invitation');
        }
    };

    return (
        <div className="invitations-container">
            {loading && <p className="loading-text">Loading...</p>}  
            {error && <div className="error">{error}</div>}
    
            {invitations.length === 0 ? (
                <p className="no-invitations">No invitations available</p>
            ) : (
                <ul className="invitations-list">
                    {invitations.map((invite) => (
                        <li key={invite._id} className="invitation-item">
                            <p><strong>Group Name:</strong> {invite.name}</p>
                            <p><strong>Description:</strong> {invite.description}</p>
                            <button
                                className="invitation-button"
                                onClick={() => handleAccept(invite._id)}
                            >
                                Accept
                            </button>
                            <button
                                className="invitation-button reject"
                                onClick={() => handleReject(invite._id)}
                            >
                                Reject
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    
};


export default Invitations;
