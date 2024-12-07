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
        permissions: { edit: false, view: true },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/create', form);
            alert('Group created successfully!');
            setForm({
                name: '',
                description: '',
                privacy: 'public',
                permissions: { edit: false, view: true },
            });
        } catch (error) {
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
        <label>
            Allow Edit:
            <input
                type="checkbox"
                checked={form.permissions.edit}
                onChange={(e) =>
                    setForm({ ...form, permissions: { ...form.permissions, edit: e.target.checked } })
                }
            />
        </label>
        <label>
            Allow View:
            <input
                type="checkbox"
                checked={form.permissions.view}
                onChange={(e) =>
                    setForm({ ...form, permissions: { ...form.permissions, view: e.target.checked } })
                }
            />
        </label>
        <button type="submit">Create Group</button>
    </form>
    
    );
};

export default CreateGroup;
