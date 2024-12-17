import React, { useState } from 'react'
import {
  Box,
  Container,
} from "@mui/material";

import ChatLeftSide from '../components/chats_components/ChatLeftSide';
import ChatRightSide from '../components/chats_components/ChatRightSide';

function Chat() {

  return (
    <>
    <Container maxWidth="lg">
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >      
    {/* Sidebar */}
      <ChatLeftSide />

      {/* Chat Section */}
      <ChatRightSide />
    </Box>
    </Container>
  </>

  )
}

export default Chat
