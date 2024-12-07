import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Groupfetched = ({ onSelectGroup }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const userEmail = localStorage.getItem('email');
                const token = localStorage.getItem('token'); // Fetch the token from localStorage
                
                // Ensure both email and token are available
                if (!userEmail || !token) {
                    setError('Authentication required.');
                    setLoading(false);
                    return;
                }
    
                const response = await axios.post(
                    'http://localhost:5000/api/group/groups/member',
                    { userEmail },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include the token in the headers
                        },
                    }
                );
    
                setGroups(response.data.groups);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized. Please log in again.');
                } else {
                    setError('Failed to fetch groups.');
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchGroups();
    }, []);
    
    if (loading) return <div>Loading groups...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h3>Groups</h3>
            {groups.length === 0 ? (
                <p>No groups found.</p>
            ) : (
                groups.map((group) => (
                    <div
                        key={group._id}
                        className="group-item"
                        onClick={() => onSelectGroup(group)}
                    >
                        {group.name}
                    </div>
                ))
            )}
        </div>
    );
};

export default Groupfetched;
