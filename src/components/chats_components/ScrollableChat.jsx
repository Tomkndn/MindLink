import { Avatar, Box,  Typography } from '@mui/material';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import useStore from '../../store/useStore';

const ScrollableChat = ({messages}) => {
    const user= useStore().user;
    
    return (
        <>
          <ScrollableFeed>
            {messages && messages.map((msg, i) => {
                
                return (
                <Box display="flex" key={i} justifyContent={msg.sender._id === user.id ? "flex-end" : "flex-start"}>
                    {/* Conditional Rendering for Avatar */}
                    {msg.sender._id !== user.id && (
                        <Avatar
                            sx={{
                                mt:"7px",
                                mr: 1,
                                src:msg.sender.profileImage || "https://via.placeholder.com/40",
                                alt:msg.sender.username
                            } }
                        />
                    )}

                    {/* Message Box */}
                    <Box
                        sx={{
                            ml: msg.sender._id !== user.id ? 1:0 ,
                            backgroundColor: msg.sender._id === user.id ? "#4caf50" : "#f5f5f5",
                            color: msg.sender._id === user.id ? "white" : "black",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            maxWidth: "70%",
                            marginTop: 2,
                        }}
                    >
                        <Typography variant="body2">
                            {msg.content}
                        </Typography>
                    </Box>
                </Box>
                );
            })}
          </ScrollableFeed>
        </>
    );
}

export default ScrollableChat;

// const messages = [
//     {
//         _id: "1",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" }, 
//         content: "Hey! 🍕 Don't forget our pizza night at your place this Saturday. I'm bringing my famous veggie pizza...",
//         contentType: "text", 
//         chat: "chat1",
//         status: "sent",
//         createdAt: "2024-12-09T10:00:00Z",
//     },
//     {
//         _id: "2",
//         sender: { _id: "2", name: "You", avatarUrl: "https://via.placeholder.com/40" }, 
//         content: "Sounds delicious, Meera! 😋 Can't wait for Saturday! By the way, do you think we should get some ice cream for dessert?",
//         contentType: "text",
//         chat: "chat1",
//         status: "delivered",
//         createdAt: "2024-12-09T10:05:00Z",
//     },
//     {
//         _id: "3",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Absolutely! 🍦 I'm all in for ice cream. I'll bring my favorite flavors. What's your preference?",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:10:00Z",
//     },
//     {
//         _id: "4",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "By the way, what kind of pizza do you want me to bring? 😅",
//         contentType: "text",
//         chat: "chat1",
//         status: "sent",
//         createdAt: "2024-12-09T10:12:00Z",
//     },
//     {
//         _id: "5",
//         sender: { _id: "2", name: "You", avatarUrl: "https://via.placeholder.com/40" },
//         content: "I think a veggie pizza sounds great! Maybe a side of garlic bread too. 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "delivered",
//         createdAt: "2024-12-09T10:15:00Z",
//     },
//     {
//         _id: "6",
//         sender: { _id: "2", name: "You", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Oh! And don't forget to bring some drinks as well. 🍹",
//         contentType: "text",
//         chat: "chat1",
//         status: "delivered",
//         createdAt: "2024-12-09T10:18:00Z",
//     },
//     {
//         _id: "7",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Got it! Drinks and garlic bread are on the list. See you on Saturday! 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:20:00Z",
//     },
//     {
//         _id: "8",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Got it! Drinks and garlic bread are on the list. See you on Saturday! 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:20:00Z",
//     },
//     {
//         _id: "9",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Got it! Drinks and garlic bread are on the list. See you on Saturday! 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:20:00Z",
//     },
//     {
//         _id: "10",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Got it! Drinks and garlic bread are on the list. See you on Saturday! 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:20:00Z",
//     },
//     {
//         _id: "11",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Got it! Drinks and garlic bread are on the list. See you on Saturday! 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:20:00Z",
//     },
//     {
//         _id: "12",
//         sender: { _id: "1", name: "Meera", avatarUrl: "https://via.placeholder.com/40" },
//         content: "Got it! Drinks and garlic bread are on the list. See you on Saturday! 😄",
//         contentType: "text",
//         chat: "chat1",
//         status: "read",
//         createdAt: "2024-12-09T10:20:00Z",
//     }
// ];
