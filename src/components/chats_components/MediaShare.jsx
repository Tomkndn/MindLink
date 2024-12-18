import { Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react'

const MediaShare = ({children, onMediaChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => setAnchorEl(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    //^ MUI Menu functions

    const imgRef = useRef(null);
    const vidRef = useRef(null);
    const docRef = useRef(null);

    const handleChange= (e) => {
        console.log('File selected:', e.target.files[0].type);
        const file = e.target.files[0];
        handleClose();
        if (!file) {
            console.log('No file selected.');
            return;
        }
        onMediaChange(file);
        // if(file.type.startsWith('image/')){
        //   console.log(file);
        //   onMediaChange('image', file);
        // }  
        // if(file.type.startsWith('video/')){
        //   onMediaChange('video', file);
        // }  
        // if(file.type.startsWith('application/')){
        //   console.log(file);
        //   onMediaChange('application', file);
        // }  
    }

  return (
    <div>
        <span onClick={handleClick}>{children}</span>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=> imgRef.current.click()}>
            <span>Image</span>
            <input 
              type='file'
              ref={imgRef}
              style={{display: 'none'}}
              accept='image/jpg,image/png,image/jpeg,image/gif'
              onChange={handleChange}
            />
        </MenuItem>
        
        <MenuItem onClick={()=> vidRef.current.click()}>
          <span>Video</span>          
          <input 
            type='file'
            ref={vidRef}
            style={{display: 'none'}}
            accept='video/*'
            onChange={handleChange}
          />
        </MenuItem>
        <MenuItem onClick={()=> docRef.current.click()}>
          <span>Document</span>
          <input 
            type='file'
            ref={docRef}
            style={{display: 'none'}}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={handleChange}
          />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default MediaShare