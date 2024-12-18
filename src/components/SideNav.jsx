import React from 'react'
import user from '../assets/user (1).png';
import dashboard from '../assets/dashboard (1).png';
import bell from '../assets/bell (1).png';
import logout from '../assets/logout (1).png';
import meeting from '../assets/videocall.png';
import chat from '../assets/comment.png';
import group from '../assets/people.png';
import '../SideNav.css'
import { Link } from 'react-router-dom';
import { User, Grid, Clock, History, MessageCircle, LogOut } from 'lucide-react'; 
import useStore from "../store/useStore";
import { toast } from 'react-toastify';

const SideNav = () => {
  const {logout} = useStore();
  return (
    <>
      <div className="sidebar text-white">
        <div className="nav-items">
          <Link to="/updateprofile" className="item div-item1">
            <User className="icon user-icon" />
          </Link>
          <Link to={"/dashboard"} className="item div-item2">
            <img src={dashboard} alt="dashboard" className="icon dash-icon" />
          </Link>
          <Link to="/meeting" className="item div-item3">
            <Clock className="icon meeting-icon" />
          </Link>
          <Link to="/pastmeeting" className="item div-item4">
            <History className="icon past-meeting-icon" />
          </Link>
          <Link to="/chat" className="item div-item5">
            <MessageCircle className="icon chat-icon" />
          </Link>
          <Link onClick={() => {
            toast.success("Logged out successfully")
            logout()
          }
          } className="item div-item6">
            <LogOut className="icon logout-icon" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default SideNav
