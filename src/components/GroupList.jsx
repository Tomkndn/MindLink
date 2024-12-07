import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './GroupList.css'; 

const API = axios.create({
    baseURL: 'http://localhost:5000/api/group',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { data } = await API.get('/');
                setGroups(data);
                setLoading(false);
            } catch (error) {
                alert('Error fetching groups: ' + (error.response?.data?.message || error.message));
            }
        };
        fetchGroups();
    }, []);

    const handleJoin = async (groupId) => {
        try {
            await API.post(`/${groupId}/join`);
            alert('Joined group successfully!');
        } catch (error) {
            alert('Error joining group: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="group-list-container">
            <h2 className="group-list-title">Group List</h2>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : (
                groups.map((group) => (
                    <div key={group._id} className="group-card">
                        <h3 className="group-name">{group.name}</h3>
                        <p className="group-description">{group.description}</p>
                        <p className="group-privacy">Privacy: {group.privacy}</p>
                        <button className="join-button" onClick={() => handleJoin(group._id)}>
                            Join
                        </button>
                        <Link className="invite-link" to={`/groups/${group._id}/invite`}>
                            Invite User
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default GroupList;
