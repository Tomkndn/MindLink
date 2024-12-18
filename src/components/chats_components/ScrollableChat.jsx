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
                        {/* for text  */}
                        {(!msg.contentType || msg.contentType === 'text') && (
                            <Typography variant="body2">
                            {msg.content}
                        </Typography>
                
                        )}
                        {/* for image */}
                        {msg.contentType === 'image' && (
                            <img 
                                src={msg.content} 
                                alt="Image" 
                                style={{ maxWidth: "100%", borderRadius: "2px", marginTop: 4 }} 
                            />
                        )}
                        {/* for video */}
                        {msg.contentType === 'video' && (
                            <video 
                                src={msg.content} 
                                controls 
                                style={{ maxWidth: "100%", borderRadius: "6px", marginTop: 4 }} 
                            />
                        )}
                        {/* for document */}
                        {msg.contentType === 'document' && (
                            <a 
                                href={msg.content} 
                                style={{
                                    textDecoration: "none",
                                    color: msg.sender._id === user.id ? "white" : "black",
                                    display: "block",
                                    marginTop: 4,
                                }}
                            >
                                Download Document
                            </a>
                        )}
                    </Box>
                </Box>
                );
            })}
          </ScrollableFeed>
        </>
    );
}

export default ScrollableChat;
