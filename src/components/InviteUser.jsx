import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './InviteUser.css';


const API = axios.create({
    baseURL: 'http://localhost:5000/api/group',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const InviteUser = () => {
    const [userEmail, setUserEmail] = useState('');
    const { groupId } = useParams(); 

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
    
            await API.post(`/${groupId}/invite`, { invitedUserEmail: userEmail });
            alert('User invited successfully!');
            setUserEmail('');
        } catch (error) {
            alert('Error inviting user: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <form onSubmit={handleInvite} className="invite-user-form">
    <h2>Invite User to Group {groupId}</h2>
    <input
        type="email"
        placeholder="User Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        required
    />
    <button type="submit">Invite</button>
</form>

    );
};

export default InviteUser;
