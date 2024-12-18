import { React, useState, useEffect } from 'react';
import '../DashMain.css';
import Todo from "./Todo";
import piechart from '../assets/pie-chart.png';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import FocusSessionChart from './FocusSessionChart';
import cross from '../assets/cross (1).png'
const DashMain = () => {
  const [MeetingData, setMeetingData] = useState([]);
  const [status, setStatus] = useState('upcoming');
  const [userId, setUserId] = useState('');
  const [username, setUsernames] = useState('');
  const [focustime, setfocustime] = useState(0);
  const [groups, setgroups] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [meetId, setmeetid] = useState('');
  const [invites,setinvites] = useState([]);
  const [invitestatus,setinvitestatus] = useState('accepted');
  const [loading, setLoading] = useState(false); 
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState('');
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheUserId = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.id !== userId) {
          setUsernames(decoded.username);
          setUserId(decoded.id); 
        }
      } else {
        console.error("Token not found");
      }
    };
    fetchTheUserId();
  }, [userId]); 

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setLoading(true); 
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        let endpoint = 'http://localhost:5000/api/meeting/upcomingmeetings'; 
        if (status === 'recent') {
          endpoint = 'http://localhost:5000/api/meeting/recentmeetings'; 
        }
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          console.log(response.data);
          setMeetingData(response.data);
        } else {
          console.error('Error: Data structure is not as expected');
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
      } finally {
        setLoading(false); 
      }
    };
    fetchMeetingData();
  }, [status]);


  useEffect(() => {
    const fetchFocustime = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/focus-session/totalhours', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setfocustime(response.data.focusTime);
        }
      } catch (err) {
        console.error('Error fetching focus time:', err);
      }
    };
    fetchFocustime();
  }, []);


  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/group/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const limitedGroups = response.data.slice(0, 6);
          setgroups(limitedGroups);
        }
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };
    fetchAllGroups();
  }, []);


  const handleRegisterClick = async (meeting_id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/meeting/register/${meeting_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setIsRegistered(true); 
        alert('Successfully registered');
      }else if(response.status === 403)
      {
        alert('You can not register yourself');
      }
       else if (response.status === 400) {
        alert('Already registered');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("You cannot register for your own meeting.");
      } else {
        console.error("Error registering:", error);
      }
      
    }
  };


  const handleInviteClick = (meetingid) => {
    setmeetid(meetingid);
    setShowInvitePopup(true); 
  };

  
  const handleSendInvite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      console.log(meetId);
      console.log(email);
      const response = await axios.post(
        `http://localhost:5000/meeting/invitation/${meetId}`,
        { email: email},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert('Invite sent successfully!');
        setMessage('Invite sent successfully!');
        setShowInvitePopup(false);
      }
    } catch (error) {
      if(error.response.status === 404) {
        alert(error.response.data.message);
      }else if(error.response.status === 403)
      {
        alert('You can not send an invite ');
      }
      else if(error.response.status === 400){
        alert(error.response.data.message);
      }
      else{
      console.error('Error inviting user:', error.response);
      alert('Error sending invite!');
      }
    }
  };

  useEffect(()=>{
    const fetchinvites = async () =>{
    try{
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get('http://localhost:5000/meeting/meetinginvites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          console.log(response.data);
          const filteredInvites = response.data.invites.filter(invite => invite.status === 'pending'); 
        setinvites(filteredInvites); 
        } else {

          console.error('Error: Data structure is not as expected');
        }
    }catch(error){
      if(error.response.status === 404)
      {
        alert(error.response.data.message);
      }
      console.error('Error fetching invites:', error);
    }
  }
  fetchinvites();
  },[])

  const handleInviteAction = async (meetingId, inviteid,email) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      // First, join the meeting
      // console.log("meeting id: "+meetingId)
      // console.log("invite status: "+invitestatus);
      const response = await axios.post(
        `http://localhost:5000/meeting/invite/${meetingId}`, 
        {email,meetingId},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      
      const response2 = await axios.patch(
        `http://localhost:5000/meeting/updateinvite/${inviteid}`, 
        { status : invitestatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200 && response2.status === 200) {
        alert('Request accepted');
        console.log('Join meeting response:', response.data);
        console.log('Update invite response:', response2.data);
        
      } else {
        console.error('Error: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error processing invite action:', error.response ? error.response.data : error.message);
      alert('There was an error processing the request.');
    }
  };

  const handleInviteAction2 = async (meetingId, inviteid,email) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response2 = await axios.patch(
        `http://localhost:5000/meeting/updateinvite/${inviteid}`, 
        { status : 'declined' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response2.status === 200) {
        alert('Request declined successfully');
        console.log('Update invite response:', response2.data);
      } else {
        console.error('Error: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error processing invite action:', error.response ? error.response.data : error.message);
      alert('There was an error processing the request.');
    }
  };

  useEffect(() => {
    const fetchInvitations = async () => {
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                setError('No token found. Please log in.');
                setLoading(false);
                return;
            }
            const userEmail = localStorage.getItem('email'); 

            const response = await axios.post(
                'http://localhost:5000/api/group/invites', 
                { userEmail }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        'Content-Type': 'application/json', 
                    },
                }
            );
            console.log(response.data);  
            if (response.status === 200) {
                setInvitations(response.data.groups);
            } else {
                setError('Failed to fetch invitations. Please try again.');
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch invitations:', err);
            setError('Failed to fetch invitations');
            setLoading(false);
        }
    };

    fetchInvitations();
}, []);

const handleAccept = async (groupId) => {
    console.log('Group ID received in handleAccept:', groupId); 
    if (!groupId) {
        console.error('Group ID is undefined');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token not found");
        }

        const response = await axios.post(
            'http://localhost:5000/api/group/invites/accept',
            {
                userEmail: localStorage.getItem('email'),  
                groupId: groupId,       
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data); 
        if (response.status === 200) {
            alert("Invite accepted successfully!");
        }
    } catch (error) {
        console.error("Error accepting invite:", error);
        alert("Failed to accept the invitation.");
    }
};

const handleReject = async (groupId) => {
    if (!groupId) {
        console.error('Group ID is undefined');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'http://localhost:5000/api/group/invites/reject', 
            { userEmail: localStorage.getItem('email'), groupId }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data)
        if (response.status === 200) {

            setInvitations((prevInvitations) =>
                prevInvitations.filter((invite) => invite.groupId !== groupId)
            );
            alert('Invitation rejected!');
        } else {
            setError('Failed to reject invitation.');
        }
    } catch (err) {
        console.error('Error rejecting invite:', err);
        setError('Failed to reject invitation');
    }
};
  return (
    <>
      <div className='main-dash-section'>
        <div className='main-left-section'>
          <div className='main-div-sec1'>
            <div className='main-div-text'>
              <h1 className='dash-heading1'>Welcome {username}</h1>
              <p className='dash-para1'>Your dashboard is here.</p>
            </div>
            <div className='main-div-btn'>
              <Link to='/create'><button className='create-group-btn'>Create Group</button></Link>
              <Link to='/meeting'><button className='create-group-btn2'>Create Meeting</button></Link>
            </div>
          </div>

          <div className='main-div-sec2'>
            <div className='main-focus-div'>
              <div className='main-total-group-div'>
                <div className='main-inside-div'>
                  <h1 className='total-group-count'>{groups.length}</h1>
                </div>
                <h2>Total Groups Created</h2>
              </div>
              <div className='main-focus-hr-div'>
                <div className='main-inside-div'>
                  <h1 className='total-group-count2'>{focustime}</h1>
                </div>
                <h2>Break Your Own Record</h2>
                <Link to='/focus'><button className='create-focus-btn'>Focus Session</button></Link>
              </div>
            </div>
            <div className='main-pichart-div'>
              <div className='main-chart-div'>
                <FocusSessionChart />
              </div>
            </div>
          </div>
          <h1 className='main-div-sec3-heading'>Groups Requests</h1>
          <div className='main-div-sec3'>
            <div className='joined-group'>
              {groups.map((group, index) => (
                <div key={index} className="groups">
                  <div className="user-info">
                  </div>
                  <div className="user-action">
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <p>Members: {group.members.length}</p>
                    <button className="join-btn">Open</button>
                  </div>
                </div>
              ))}
            </div>
            <div className='user-files'>
            <div>
      {invites.length > 0 ? (
        invites.map((invite) => (
          <div key={invite._id} className="invite-card">
            <h2 className='invite-h2'>Hi {invite.userId.username}!</h2>
            <p className='invite-msg'>You're invited to join <b>"{invite.meetingId.title} meeting" </b></p>
            <button
              onClick={() => {
                setinvitestatus('accepted');  
                handleInviteAction(invite.meetingId._id, invite._id, invite.userId.email); 
            }}
              className="invite-button">
              Accept
            </button>
            <button
              onClick={() => {
                setinvitestatus('declined');  
                handleInviteAction2(invite.meetingId._id, invite._id, invite.userId.email);  
            }}
              className="invite-button">
              Decline
            </button>
          </div>
        ))
      ) : (
        <p></p>
      )}
      {(invitations && invitations.length > 0) ? (
  invitations.map((invite) => (
    <div key={invite._id} className="invite-card">
      <h2 className='invite-h2'>You're invited to join the group <b>"{invite.name}"</b></h2>
      <p className='invite-msg'>{invite.description}</p>
      <button
        onClick={() => {
          handleAccept(invite._id); // Accept invite
        }}
        className="invite-button">
        Accept
      </button>
      <button
        onClick={() => {
          handleReject(invite._id); // Reject invite
        }}
        className="invite-button">
        Reject
      </button>
    </div>
  ))
) : (
  <p className="no-invitations"></p>
)}
    </div>
            </div>
          </div>

        </div>
        <div className='main-right-section'>
          <h1 className='Meeting-info'>Meetings</h1>
          <div className='main-meeting-section'>
            <button className='upcoming-btn' onClick={() => { setStatus('upcoming') }}>Upcoming</button>
            <button className='recent-btn' onClick={() => { setStatus('recent') }}>Recent</button>
          </div>
          <div className='user-meeting'>
            {loading ? (
              <p>Loading...</p> 
            ) : MeetingData.length === 0 ? (
              <p>No meetings available</p>
            ) : (
              <div>
                {MeetingData.map((meeting) => (
                  <div key={meeting._id} className="meeting-card">
                    <h3 className='meeting-title'>{meeting.title}</h3>
                    <p><strong>Date:</strong> {new Date(meeting.date).toLocaleString()}</p>
                    <p><strong>Description:</strong> {meeting.description}</p>
                    <p><strong>Status:</strong> {meeting.privacy}</p>
                    <div className='meeting-btn-div'>
                    {status === 'upcoming' && meeting.privacy == 'public' &&(
                        <button className='meeting-join-btn' onClick={() => handleRegisterClick(meeting._id)}>Register</button>
                      )}
                      {status === 'upcoming' &&(
                        <button className='meeting-join-btn1' onClick={() => handleInviteClick(meeting._id)}>Invite</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showInvitePopup && (
            <div className='invite-popup'>
            <img src={cross} alt="cross" className='cross-image' onClick={() => setShowInvitePopup(false)}></img>
              <label className='invite-label'>Email</label><br />
              <input
                type='email'
                placeholder='Enter email'
                className='invite-email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className='invite-sent-btn'
                onClick={handleSendInvite} 
              >
                Send
              </button>
              {message && <p>{message}</p>}
            </div>
          )}

          <h1 className='Meeting-info'>To-do</h1>
          <div className='user-to-do'>
            <Todo />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashMain;
