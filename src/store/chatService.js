import axios from 'axios';

export const fetchMessages = async (groupId) => {
    const response = await axios.get(`/api/chats/${groupId}/messages`);
    return response.data.messages;
};

export const sendMessage = async (groupId, content) => {
    const response = await axios.post(`/api/chats/${groupId}/messages`, { content });
    return response.data.message;
};

export const fetchUserProfile = async (userId) => {
    const response = await axios.get(`/api/user/${userId}`);
    return response.data.user;
};