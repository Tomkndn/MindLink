import React from 'react';
import { Avatar, Box, Typography, ListItemButton } from '@mui/material';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <ListItemButton
      onClick={handleFunction}
      sx={{
        bgcolor: '#E8E8E8',
        '&:hover': {
          backgroundColor: '#38B2AC',
          color: 'white',
        },
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        px: 2,
        py: 1,
        mb: 1,
        borderRadius: 1,
      }}
    >
      <Avatar
        sx={{ marginRight: 2 }}
        alt={user.name}
        src={user.pic}
      />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {user.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
          Email: {user.email}
        </Typography>
      </Box>
    </ListItemButton>
  );
};

export default UserListItem;
