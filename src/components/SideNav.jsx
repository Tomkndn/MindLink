import React from 'react'
import user from '../assets/user (1).png';
import dashboard from '../assets/dashboard (1).png';
import bell from '../assets/bell (1).png';
import logout from '../assets/logout (1).png';
import meeting from '../assets/videocall.png';
import chat from '../assets/comment.png';
import group from '../assets/people.png';
import '../SideNav.css'
const SideNav = () => {
  return (
    <>
    <div className="sidebar">
        <div className='nav-items'>
        <div className='item div-item1'><img src={user} alt="User"  className='icon user-icon'/></div> 
        <div className='item div-item2'><img src={dashboard} alt="dashboard" className='icon dash-icon'/></div> 
        <div className='item div-item4'><img src={bell} alt="bell" className='icon bell-icon'/></div>
        <div className='item div-item5'><img src={meeting} alt="logout" className='icon logout-icon'/></div>
        <div className='item div-item6'><img src={group} alt="logout" className='icon logout-icon'/></div>
        <div className='item div-item7'><img src={chat} alt="logout" className='icon logout-icon'/></div>
        <div className='item div-item8'><img src={logout} alt="logout" className='icon logout-icon'/></div>
    </div>
    </div>
    </>
  )
}

export default SideNav
