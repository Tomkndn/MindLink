import {React, useState , useEffect} from 'react'
import '../DashMain.css'
import Todo from '../components/Todo'
import piechart from '../assets/pie-chart.png'
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

const DashMain = () => {
  const [MeetingData,setMeetingData] = useState([]);
  const [status,setStatus] = useState('recent')
  const [userId,setUserId] = useState('');
  const[username,setUsernames] = useState('');

  useEffect(() => {
    const fetchTheUserId = () => {
      const token = localStorage.getItem('token');
      
      if (token) { 
        const decoded = jwtDecode(token);

        
        if (decoded.id !== userId) {
          console.log(decoded.id);
          setUsernames(decoded.username)
          setUserId(decoded.id);
        }
      } else {
        console.error("Token not found");
      }
    };

    fetchTheUserId();
  }, [userId]);

  // useEffect(() => {
  //   const fetchingMeentinData = async () => {
  //   try{
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       console.error('No token found');
  //       return;
  //     }
   
  //     console.log(status);
  //       const response = await axios.get('http://localhost:5000/api/meeting/upcomingmeetings',{
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Add token to Authorization header
    
  //     }});
  //     if(response.status == 200)
  //     { 
  //       console.log('Upcomingmeetings fetched successfully');
  //       setMettingData(response.data);
  //     }
  //   }catch(err)
  //   {
  //     console.log(err);
  //   }
  // }
  // fetchingMeentinData();
  // },[],status);
  // Fetch meetings based on the current status

  const fetchMeetingData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        return;
      }

      let endpoint = 'http://localhost:5000/api/meeting/upcomingmeetings'; // Default endpoint for 'upcoming'

      // Switch the endpoint based on status
      console.log(status);
      if (status === 'recent') {
        endpoint = 'http://localhost:5000/api/meeting/recentmeetings'; // Change endpoint for 'recent'
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response: " ,response);
      if (response.status === 200 ) {
        console.log('Meetings fetched successfully');
        setMeetingData(response.data);
      } else {
        console.error('Error: Data structure is not as expected');
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

useEffect(() => {
  fetchMeetingData();
}, [status]); 

  useEffect(() => {
    console.log('Meeting Data:', MeetingData); // Logs when meetingData is initially fetched 
    console.log('Updated Meeting Data:', MeetingData.length); // Logs when meetingData changes
  }, [MeetingData]); // Trigger this effect when meetingData updates
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
            <button className='create-group-btn'>create group</button>
          </div>
      </div>
      <div className='main-div-sec2'> 
          <div className='main-focus-div'>
                <div className='main-total-group-div'>
                    <div className='main-inside-div'>
                      <h1 className='total-group-count'>5</h1>
                    </div>
                    <h2>Total</h2>
                    <h2>Group Created</h2>
                </div>
                <div className='main-focus-hr-div'>
                <div className='main-inside-div'>
                      
                </div>
                <h2>Break Your Own Record</h2>
                <Link to='/focus' ><button className='create-focus-btn'>Focus session</button></Link>
                </div>
          </div>
          <div className='main-pichart-div'>
            <div className='main-chart-info-div'>
                  <div className='main-div-info'>1</div>
                  <div className='main-div-info'>2</div>
                  <div className='main-div-info'>3</div>
            </div>
            <div className='main-chart-div'>
              <img src={piechart} className='chart-img'></img>
            </div>
          </div>
      </div>
      <div className='main-div-sec3'> 
          <div className='joined-group'>
            <div className='groups'>
              <div className='user-info'>

              </div>
              <div className='user-action'>
                <h2>Group Name</h2>
                <p>Group Description</p>
                <p>Members: 14</p>
                <button className='join-btn'>open</button>
            </div>
          </div>
          <div className='groups'>
              <div className='user-info'>

              </div>
              <div className='user-action'>
                <h2>Group Name</h2>
                <p>Group Description</p>
                <p>Members: 14</p>
                <button className='join-btn'>open</button>
            </div>
          </div>
          <div className='groups'>
              <div className='user-info'>

              </div>
              <div className='user-action'>
                <h2>Group Name</h2>
                <p>Group Description</p>
                <p>Members: 14</p>
                <button className='join-btn'>open</button>
            </div>
          </div>
          <div className='groups'>
              <div className='user-info'>

              </div>
              <div className='user-action'>
                <h2>Group Name</h2>
                <p>Group Description</p>
                <p>Members: 14</p>
                <button className='join-btn'>open</button>
            </div>
          </div>
          <div className='groups'>
              <div className='user-info'>

              </div>
              <div className='user-action'>
                <h2>Group Name</h2>
                <p>Group Description</p>
                <p>Members: 14</p>
                <button className='join-btn'>open</button>
            </div>
          </div>
          <div className='groups'>
              <div className='user-info'>

              </div>
              <div className='user-action'>
                <h2>Group Name</h2>
                <p>Group Description</p>
                <p>Members: 14</p>
                <button className='join-btn'>open</button>
            </div>
          </div>
          </div>
          <div className='user-files'>

          </div>
      </div>
  </div>
  <div className='main-right-section'>
  <h1 className='Meeting-info'>Meetings</h1>
    <div className='main-meeting-section'>
      <button className='upcoming-btn' onClick={()=>{setStatus('upcoming')}}>Upcoming</button>
      <button className='recent-btn' onClick={()=>{setStatus('recent')}} >Recent</button>
    </div>
    <div className='user-meeting'>
    {MeetingData.length === 0 ? (
    <p>No upcoming meetings</p> 
    ) : (
    <div> 
      {MeetingData.map((meeting, index) => (
        <div key={meeting._id} className="meeting-card"> 
          <h3 className='meeting-title'>{meeting.title}</h3> 
          <p><strong>Date:</strong> {new Date(meeting.date).toLocaleString()}</p>
          <p><strong>Description:</strong> {meeting.description}</p> 
          <p><strong>Status:</strong> {meeting.privacy}</p> 
          {status === 'upcoming' && (
                <button className='meeting-join-btn'>Join Meeting</button>
          )}
          {status === 'recent' && (
              <button className='meeting-join-btn'>Done</button>
            )}
        </div>
      ))}
    </div>
  )}
    </div>
    <h1 className='Meeting-info'>To-do</h1>
      <div className='user-to-do'>
        <Todo/>
      </div>
    </div>
    </div>
    </>
  )
}

export default DashMain
