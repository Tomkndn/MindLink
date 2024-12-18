import { React, useState, useEffect } from 'react';
import '../DashMain.css';
import Todo from "./Todo";
import piechart from '../assets/pie-chart.png';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate , NavLink} from "react-router-dom";
import axios from 'axios';
import FocusSessionChart from './FocusSessionChart';
import cross from '../assets/cross (1).png'
import inviteimg from '../assets/cat.png';
import meetingimg from '../assets/meeting.png';
import bin from '../assets/delete.png';
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
  const [DeleteMeetId,setDeleteMeet] = useState(null);
  const [attend,setattend] = useState(true);
  const [showModal, setShowModal] = useState(false); // Controls the visibility of the modal
  const [email2, setEmail2] = useState(''); // Store the email address
  const [groupid, setgroupid] = useState(' '); 
  const [selectedGroup, setSelectedGroup] = useState(null);
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
          const limitedGroups = response.data;
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
      if(error.response.status === 403)
      {
        alert('you are not admin , You can not send an invite');
      }
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

  const deleteMeeting = async (DeleteMeetId) => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('email'); // Getting userEmail from localStorage
      const groupId = "yourGroupId"; // Ensure this is coming from state or props
      console.log("meeting id: " + DeleteMeetId)
      const response = await axios.delete(
        `http://localhost:5000/meeting/delete/${DeleteMeetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        alert('Meeting deleted successfully');
      }
    } catch (err) {
      // Handle different error cases
      if (err.response) {
        if (err.response.status === 403) {
          alert('You are not admin, You can not delete a meeting');
        } else {
          console.error('Error status:', err.response.status);
          alert('An error occurred while deleting the meeting');
        }
      } else {
        console.error('Error in useEffect:', err);
        alert('Network error occurred');
      }
    }
  };

  const isMeetingTimeNow = (meetingname, meetingDate, meetingTime) => {

    const [hour, minute] = meetingTime.split(':').map(num => parseInt(num));

    const meetingDateTime = new Date(meetingDate);
    meetingDateTime.setHours(hour, minute, 0, 0); 

    const currentDateTime = new Date(); 

    const sameDay = meetingDateTime.toDateString() === currentDateTime.toDateString();
    
    const thirtyMinutesInMillis = 30 * 60 * 1000;

    const meetingStartTime = meetingDateTime.getTime(); 
    const currentTime = currentDateTime.getTime(); 

    const isWithinTimeRange = currentTime >= meetingStartTime &&
                              currentTime <= (meetingStartTime + thirtyMinutesInMillis);

    console.log("Meeting Time: ", meetingDateTime, "Current Time: ", currentDateTime, "Is within time range? ", isWithinTimeRange);


    return isWithinTimeRange && sameDay;
};



  
  const handleJoinMeeting = async (meetingid) => {
    try {
      const token = localStorage.getItem('token');
      const roomcode = "myLink1"
      window.location.href = `http://localhost:5173/room/${roomcode}`;
      if(!attend){
        const response = await axios.post(
            `http://localhost:5000/api/meeting/joinmeeting/${meetingid}`, 
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        if(response.status === 200){
          alert('Meeting joined successfully');
          setattend(true);
        }
      }
    } catch (err) {
      alert("Error joining meeting: " + err);
      console.error("Error joining meeting: " + err);
    }
  };
  const formatTimeWithAMPM = (time) => {
    // Split the time into hours and minutes
    const [hours, minutes] = time.split(':').map(num => parseInt(num));
    
    // Create a new Date object for the time
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0); // Set seconds to 0 for precise formatting
  
    // Format the time with AM/PM
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleInviteClick2 = (groupid,groupname) => {
    setgroupid(groupid);  // Store the selected group
    setSelectedGroup(groupname);  // Store the selected group name
    setShowModal(true); // Show the modal
  };

  const handleSendInvite2 = async () => {
    try{
      const token = localStorage.getItem('token');
      const response = await axios.post(
          `http://localhost:5000/api/group/${groupid}/invite`, 
          { invitedUserEmail: email2 }, 
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          }
      );
      if(response.status === 200){
        alert('Invite sent successfully');
        setShowModal(false); 
      }
    }catch(err){
      console.error("Error sending invite: " + err);
      alert("Failed to send invite");
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
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
            <NavLink to='/create'>
              <button className='create-group-btn'>Create Group</button>
            </NavLink>
            <NavLink to='/meeting'>
              <button className='create-group-btn2'>Create Meeting</button>
            </NavLink>
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
                    <h2>{group.name.length > 15 ? group.name.substring(0,13) + '...' : group.name}</h2>
                    <p>
                    {group.description.length > 15 ? group.description.substring(0, 13) + '...' : group.description}
                    </p>
                    <p>Members: {group.members.length}</p>
                    <button className="join-btn" onClick={() => handleInviteClick2(group._id,group.title)}>invite</button>
                  </div>
                </div>
              ))}
            </div>
            <div className='user-files'>
            <div>
            {(invites?.length > 0 || invitations?.length > 0) ? (
  <div>
    {/* Invites */}
    {invites?.length > 0 && invites.map((invite) => (
      <div key={invite._id} className="invite-card">
        <h2 className='invite-h2'>Hi {invite.userId.username}!</h2>
        <p className='invite-msg'>You're invited to join <b>"{invite.meetingId.title} meeting"</b></p>
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
    ))}

    {/* Invitations */}
    {invitations?.length > 0 && invitations.map((invite) => (
      <div key={invite._id} className="invite-card">
        <h2 className='invite-h2'>You're invited to join the group <b>"{invite.name}"</b></h2>
        <p className='invite-msg'>{invite.description}</p>
        <button
          onClick={() => handleAccept(invite._id)} // Accept invite
          className="invite-button">
          Accept
        </button>
        <button
          onClick={() => handleReject(invite._id)} // Reject invite
          className="invite-button">
          Reject
        </button>
      </div>
    ))}
  </div>
) : (
  <div>
    <img src={inviteimg} alt="No invites" className="no-invites-image" />
    <p className='no-invite-msg'>No invites or invitations available</p>
  </div>
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
              <div>
              <img src={meetingimg} className='meeting-img' ></img>
              <p className='meeting-msg'>No meetings available</p>
              </div>
            ) : (
              <div>
                {MeetingData.map((meeting) => (
                  <div key={meeting._id} className="meeting-card">
                    <h3 className='meeting-title'>{meeting.title}</h3>
                    <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString('en-GB')} ,<strong>Time:</strong> {formatTimeWithAMPM(meeting.time)}</p>
                    <p><strong>Description:</strong> {meeting.description}</p>
                    <p><strong>Status:</strong> {meeting.privacy}</p>
                    <div className='meeting-btn-div'>
                    {status === 'upcoming' && meeting.privacy === 'public' && isMeetingTimeNow(meeting.title, meeting.date, meeting.time) && (
                      <button className='meeting-join-btn' onClick={() => handleJoinMeeting(meeting._id)}>Join</button>
                    )}
                      {status === 'upcoming' && meeting.privacy==='public' && !isMeetingTimeNow(meeting.title , meeting.date, meeting.time) && (
                        <button className='meeting-join-btn1' onClick={() => handleInviteClick(meeting._id)}>Register</button>
                      )}
                      {status === 'upcoming' &&(
                        <button className='meeting-join-btn1' onClick={() => handleInviteClick(meeting._id)}>Invite</button>
                      )}
                    </div>
                    <img src={bin} alt="delete" className='meeting-delete-btn' onClick={()=>deleteMeeting(meeting._id)}></img>
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
          {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Invite to {selectedGroup?.name}</h3>
            <input
              type="email"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              placeholder="Enter email"
              required
            />
            <button onClick={handleSendInvite2}>Send</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
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
