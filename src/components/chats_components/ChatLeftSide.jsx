import { MoreVert } from '@mui/icons-material'
import { Avatar, Box, IconButton, Skeleton, TextField, Typography } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'
import useStore from '../../store/useStore';
import axiosInstance from '../../store/axiosInstance'
import { formatDistanceToNow } from 'date-fns';
import { useChatState } from '../../context/ChatProvider';
import CreateSingleChat from './CreateSingleChat';

const ChatLeftSide = () => {
  const {user} = useStore();
  const token=localStorage.getItem('token');
  const [searchChat, setSearchChat] = useState('')
  const {chats, setChats, selectedChat, setSelectedChat} = useChatState()
  
  const handleSearchChat=(e)=>{
    if (e.key === 'Enter' && searchChat) {
      e.preventDefault();  
      console.log(searchChat);  
      setSearchChat('');  
    }
  }

  
  const fetchChats= async() => {
    
    try {
      const config={
        headers: {Authorization: `Bearer ${token}`},
      }
      const {data}= await axiosInstance.get("/api/chat", config);
      setChats(data);
      
    } catch (error) {
      toast.warning('Failed to fetch chats.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
      return;
    }
  }
  useEffect(()=>{
    
    fetchChats()
    
  },[])

  return (
    <>
    <Box
      sx={{
        width:{ xs: "100%",sm: "40%", md: "30%" },
        height:"100vh",
        backgroundColor:"white",
        display:{xs: selectedChat? "none":"flex", sm:"flex"},
        flexDirection:"column",
        border:"1px solid #e0e0e0",
        
      }}
    >
        {/* Profile Section */}
        <Box display="flex" alignItems="center" p={2} borderBottom="1px solid #e0e0e0">
          <Box ml={2} flex={1}>
            <Typography fontWeight="bold">Chats</Typography>
          </Box>
          <CreateSingleChat>
            <IconButton size="small" color="default" >
              <AddCircleIcon />
            </IconButton>
          </CreateSingleChat>
          
          <IconButton size="small" color="default">
            <MoreVert />
          </IconButton>
        </Box>

        {/* Search Bar */}
        {/* <Box p={2}>
          <TextField
            variant="outlined"
            placeholder="Search chats"
            size="small"
            fullWidth
            onChange={(e)=>setSearchChat(e.target.value)}
            value={searchChat}
            onKeyDown={handleSearchChat}
          />
        </Box> */}

        {/* Chats List */}
        <Box flex={1} overflow="hidden">
          { chats ? (
            <Box display="flex" flexDirection="column" gap="8px" >
              {chats.map((chat) => {
                  const getSender = (loggedUser, users) => {
                    return users[0]._id === loggedUser.id ? users[1] : users[0];
                  };
                  const sender = !chat.isGroupChat ? getSender(user, chat.users) : null;
                  let timeAgo;
                  if(chat.latestMessage){
                    const latestMsgCreatedAt= chat.latestMessage.createdAt;
                    timeAgo=formatDistanceToNow(new Date(latestMsgCreatedAt), {addSuffix: true});
                  }
                return (
                <Box
                  key={chat._id}
                  onClick={()=>setSelectedChat(chat)}
                  display="flex"
                  alignItems="center"
                  p={2}
                  bgcolor={selectedChat===chat ? "#d7ffd9": "#e8f5e9"}
                  borderRadius={1}
                  
                  sx={{
                    cursor: "pointer",
                    // '&:hover': { bgcolor: "#d7ffd9" },
                  }}
                >
                  {!chat.isGroupChat ?
                    <Avatar src={sender?.profileImage} alt={sender?.name} /> :
                    <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHd26dvClIXeNbaHibs6NG8PiZRNuFyjyLHw&s" alt={chat.chatName} /> 
                  }
                  <Box ml={2} flex={1}>
                    <Typography fontWeight="medium">
                      {!chat.isGroupChat ? sender?.username || "Unknown" : chat.chatName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" >
                      {/* {chat.latestMessage?.content || 'No Messages yet'} */}
                      {chat.latestMessage?.content 
                        ? chat.latestMessage.content.split(' ').slice(0, 5).join(' ') + (chat.latestMessage.content.split(' ').length > 10 ? '...' : '') 
                        : 'No Messages yet'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {chat.latestMessage ? timeAgo : ''}
                  </Typography>
                </Box>)

              })}
            </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap="8px">
              <Skeleton variant="rectangular" height="45px" />
              <Skeleton variant="rectangular" height="45px" />
              <Skeleton variant="rectangular" height="45px" />
              <Skeleton variant="rectangular" height="45px" />
              <Skeleton variant="rectangular" height="45px" />
              <Skeleton variant="rectangular" height="45px" />
              <Skeleton variant="rectangular" height="45px" />
            </Box>
            )
          }
        </Box>
      </Box>
    </>
  )
}

export default ChatLeftSide
