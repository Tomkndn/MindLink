import React, { useState } from 'react'
import  {  Button, Box, Typography, Dialog, DialogTitle, DialogContent, TextField, CircularProgress, DialogActions, IconButton } from '@mui/material';
import UserListItem from './UserListItem';
import { useChatState } from '../../context/ChatProvider';
import axiosInstance from '../../store/axiosInstance';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSingleChat = ({children}) => {
    const [open, setOpen] = useState(false);
    const handleOpen=()=> setOpen(true);
    const handleClose=()=> setOpen(false);

    const [selectedUser, setSelectedUser] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const {chats, setChats} = useChatState();

    const handleSearch = async (query)=> {
        if(!query) {
            return;
        }
        try {
            setLoading(true);
            let token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const {data} = await axiosInstance.get(`/user?search=${query}`, config);
            
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast.warning('Failed to load searched users.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "colored",
              });
              setLoading(false);
        }
    }
    
    const handleSubmit = async () => {
        if(!selectedUser){
            toast.warning('Please select a user before proceeding.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "colored",
              });
              return;
        }
        try {
            let token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            
            const {data} = await axiosInstance.post(`/api/chat/`, 
                {userId: selectedUser._id}, config);
            
            
            const chatExists = chats.some((chat) => chat._id === data._id);
            if (chatExists) {
                toast.warning('Chat already exists.', {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    theme: "colored",
                });
                setSelectedUser(null);
                setSearchResults([]);
                setOpen(false);
                return;
            } 
    
            setChats((prevChats) => [data, ...prevChats]);
            
            setSelectedUser(null);
            setSearchResults([]);
            setOpen(false);
            toast.success('New chat created.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "colored",
              });
            
        } catch (error) {
            toast.error(`Failed to create chat`, {
                position: "bottom-right",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                theme: "colored",
            });
        }
    }
  return (
    <>
        <span onClick={handleOpen}>{children}</span>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
            sx={{
            fontSize: "35px",
            fontFamily: "Work sans",
            display: "flex",
            justifyContent: "center",
            }}
        >
            Chat with others
        </DialogTitle>

        <DialogContent
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
        >
            <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="Add Users e.g., John, Jane"
            onChange={(e) => handleSearch(e.target.value)}
            />
            
            {/* Selected Users */}
            <Box
            sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: 2,
            }}
            >            
             {selectedUser ? (
                <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                    mb:2,
                    borderRadius: 1,
                    fontSize: 12,
                    backgroundColor: '#d7ffd9',
                    color: 'white',
                    cursor: 'pointer',
                }}
                >
                    <Typography sx={{ color: 'black' ,fontSize: 12, fontWeight: 500 }}>{selectedUser.username}</Typography>
                    <IconButton
                        size="small"
                        sx={{
                        color: 'black',
                        padding: 0,
                        marginLeft: 1,
                        }}
                        onClick={() => {setSelectedUser(null)}}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

             ) : (<></>)}
            </Box>

            {/* Render Searched Users */}
            {loading ? (
                <Box>
                    <Typography>Loading <CircularProgress size={24} /></Typography>
                </Box>
                
            ) : (
                searchResults?.length ? (
                    searchResults.slice(0, 4).map((user) => (
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => {
                                setSelectedUser(user)
                            }} 

                        />
                    ))
                ) : (
                    <Typography variant="body2" sx={{ p: 2 }}>No users found</Typography> 
                )
            )}
        </DialogContent>

        <DialogActions>
            <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ bgcolor: "#4caf50" }}
            >
            Create Chat
            </Button>
        </DialogActions>
    </Dialog>   

        
    </>
  )
}

export default CreateSingleChat