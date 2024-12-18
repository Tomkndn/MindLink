import React, { useState } from 'react';
import axios from 'axios';
import './CreateGroup.css';

// API setup
const API = axios.create({
    baseURL: 'http://localhost:5000/api/group',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token'); 
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

const CreateGroup = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        privacy: 'public',
    });

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminEmail = localStorage.getItem('email'); 
        if (!adminEmail) {
            return alert('Admin email not found in localStorage.');
        }

        try {
            const { data } = await API.post('/create', {
                name: form.name,
                description: form.description,
                privacy: form.privacy,
                adminEmail: adminEmail, 
            });

            alert('Group created successfully!');
            setForm({
                name: '',
                description: '',
                privacy: 'public',
            });
        } catch (error) {
            console.error("Error while creating group:", error);

            alert('Error creating group: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-group-form">
            <h2>Create Group</h2>
            <input
                type="text"
                placeholder="Group Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
            />
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
            />
            <select
                value={form.privacy}
                onChange={(e) => setForm({ ...form, privacy: e.target.value })}
            >
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>

            <button type="submit">Create Group</button>
        </form>
    );
};

export default CreateGroup;
