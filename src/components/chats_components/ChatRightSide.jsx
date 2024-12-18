import { AttachFile, SendOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, IconButton,  TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ScrollableChat from './ScrollableChat';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useChatState } from '../../context/ChatProvider';
import useStore from '../../store/useStore';
import axiosInstance from '../../store/axiosInstance';
import io from 'socket.io-client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MediaShare from './MediaShare';
import { useRef } from 'react';

const ENDPOINT = "http://localhost:5000";
let socket;

const ChatRightSide = () => {
  let user=useStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")
  const {selectedChat, setSelectedChat} = useChatState();
  
  const [newMessageType, setNewMessageType] = useState("text")
  const [media, setMedia] = useState();
  const sendMsgRef = useRef();

  const getSender= (loggedUser, users) => {
    return loggedUser.user.id===users[0]._id ? users[1] : users[0];
  }
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {console.log("connected to socket.io");
    });
  }, [])

  const sendMessage= async () => {
    if(newMessage || media){
      try {
        console.log(media);
        
        let token=localStorage.getItem('token')
        const config={
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        let mediaUrl=null;
        if (media) {
          // mediaUrl = await uploadToCloudinary(media); // Upload media to Cloudinary
          mediaUrl= URL.createObjectURL(media);          
        }
        let content= (newMessageType==='text') ? newMessage : mediaUrl;
        
        setNewMessage("");
        setMedia(null);
        const {data} = await axiosInstance.post("/api/message",
          {
            content: content,
            chatId: selectedChat._id,
            contentType: newMessageType,
          }, config);
        // console.log(data.content);
        
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.warning('Failed to send Messages.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        });
        return;
      }
    }
  }
  const fetchMessages = async () => {
    if(!selectedChat) return;
    try {
      let token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      
      const response = await axiosInstance.get(`/api/message/${selectedChat._id}`, config)
      
      setMessages(response?.data);
      // console.log(messages);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.warning('Failed to load Messages.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
      return;
    }
  }

  const handleMediaChange= (file) => {
    setMedia(file);
    
    if(file.type.startsWith('image/')){
      setNewMessageType('image')
    }  
    if(file.type.startsWith('video/')){
      setNewMessageType('video');
    }  
    if(file.type.startsWith('application/')){
      setNewMessageType('application');
    }
  }
  useEffect(() => {
    if(media){
      console.log(media);
      console.log(newMessageType);
      
      sendMessage();
    }
  }, [media, newMessageType]);
  
  useEffect(() => {
    fetchMessages();

  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      setMessages([...messages, newMessageReceived]);
    })
    
  }, [messages]);

  return (
    <>
      <Box 
        height={"100vh"}
        flex={1} 
        display={{xs: selectedChat? "flex":"none", sm:"flex"}} 
        flexDirection="column"
        border="1px solid #e0e0e0"
      >
        {selectedChat ? (
        <>
        {/* Chat Header */}
        <Box
          display="flex"
          alignItems="center"
          p={2}
          bgcolor="#4caf50"
          color="white"
        >
          <Button
            sx={{
              display: { base: "flex", sm: "none" },
            }}
            variant='text'
            color='white'
            onClick={()=>setSelectedChat("")}
          >
            <ArrowBackIcon />
          </Button>

          {!selectedChat.isGroupChat ? (
            <Box display="flex" alignItems="center">
              <Avatar src={getSender(user, selectedChat.users)?.profileImage} alt="Meera" />
              <Typography variant="h6" ml={2}>
                {getSender(user, selectedChat.users).username}
              </Typography>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHd26dvClIXeNbaHibs6NG8PiZRNuFyjyLHw&s" alt="groupProfilePic" />
              <Typography variant="h6" ml={2}>
                {selectedChat.chatName}
              </Typography>
            </Box>
          )}
          
        </Box>

        {/* Chat Messages */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          p={3}
          width="100%"
          height="100%"
          borderRadius="lg"
          overflow="hidden"
        >
          <div className="flex flex-col overflow-y-auto scrollbar-none p-3">
            <ScrollableChat messages={messages} />
          </div>

          {/* Chat Input */}
          <Divider />
          <Box display="flex" alignItems="center" p={2} bgcolor="white">
            <MediaShare onMediaChange={handleMediaChange}>
              <IconButton size="small" color="default">
                <AttachFile />
              </IconButton>
            </MediaShare>
            <TextField
              variant="outlined"
              placeholder="Type a message"
              size="small"
              fullWidth
              sx={{ mx: 2 }}
              onChange={(e)=>{setNewMessage(e.target.value)}}
              value={newMessage}
              onKeyDown={(e) => {if(e.key==='Enter') sendMsgRef.current.click()}}
            />
            <IconButton size="small" color="primary" onClick={sendMessage} ref={sendMsgRef}>
              <SendOutlined />
            </IconButton>
          </Box>
        </Box>
        </>
        ) : (  
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            width="100%"
            p={5}
          >
            <Typography variant="h3" sx={{ paddingBottom: 3, fontFamily: 'Work Sans' }}>
              Click on a user to start chatting
            </Typography>
          </Box>
        )
        } 

      </Box>
    </>
  )
}

export default ChatRightSide