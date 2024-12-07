import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import './FocusSession.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'; 
const FocusTimer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [userId, setUserId] = useState('');
  const [startTime, setStartTime] = useState(null); 
  const [remainingTime, setRemainingTime] = useState(0); 
  const timerRef = useRef(null);
  const navigate = useNavigate();
 
  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in localStorage.");
      return null; 
    }

    try {
      const payload = jwtDecode(token);
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; 
    }
  };

  const payload = getTokenFromLocalStorage();
  useEffect(() => {
    if (payload) {
      setUserId(payload.id);
      console.log("User ID is set");
    } else {
      console.log("User ID is not set");
    }
  }, [payload]);

  
  useEffect(() => {
    let interval;
    if (isActive) {
      const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
      setRemainingTime(totalTimeInSeconds); 

      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newRemainingTime = prevTime - 1; 
          if (newRemainingTime <= 0) {
            clearInterval(interval); 
            setIsActive(false); 
            setIsBreak(!isBreak); 
            handleSaveSession(true); 
            return 0; 
          }
          return newRemainingTime; 
        });
      }, 1000); 
    } else {
     
      clearInterval(interval);
    }

    return () => clearInterval(interval); 
  }, [isActive, isBreak, hours, minutes, seconds]);

  // Start timer
  const handleStart = () => {
    if (minutes < 1 && hours === 0) {
      alert("Minimum timer duration is 1 minute.");
      return;
    }
  
    // Fullscreen mode logic
    if (timerRef.current) {
      if (timerRef.current.requestFullscreen) {
        timerRef.current.requestFullscreen();
      } else if (timerRef.current.webkitRequestFullscreen) {
        timerRef.current.webkitRequestFullscreen(); // Safari
      } else if (timerRef.current.mozRequestFullScreen) {
        timerRef.current.mozRequestFullScreen(); // Firefox
      } else if (timerRef.current.msRequestFullscreen) {
        timerRef.current.msRequestFullscreen(); // IE/Edge
      }
    }
  
    setIsActive(true);
  };
  

  const handlePause = () => {
    setIsActive(false);
  };


  const handleReset = () => {
    setIsActive(false);
    setHours(0);
    setMinutes(25);
    setSeconds(0);
    setStartTime(null); 
    setRemainingTime(0); 
  };

  
  const handleLeave = async () => {
    setIsActive(false);

   
    await handleSaveSession(false);

  
    navigate('/dashboard');
  };

  const handleSaveSession = async (completedSession) => {
    if (!userId) {
      console.error("Error: userId is missing.");
      return;
    }

    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    const finalDurationInSeconds = completedSession
      ? totalTimeInSeconds
      : totalTimeInSeconds - remainingTime; 

    const finalHours = Math.floor(finalDurationInSeconds / 3600);
    const finalMinutes = Math.floor((finalDurationInSeconds % 3600) / 60);
    const finalSeconds = finalDurationInSeconds % 60;

    const session = {
      type: isBreak ? 'Break' : 'Focus',
      duration: `${String(finalHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}:${String(finalSeconds).padStart(2, '0')}`,
      userId: userId,
    };

    try {
      console.log("Saving session:", session);
      const response = await axios.post('http://localhost:5000/api/focus-session/save', session, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Session saved:', response.data);
    } catch (error) {
      console.error('Error saving session:', error.response?.data || error.message);
    }
  };

  const handleTimeChange = (e, type) => {
    const value = parseInt(e.target.value, 10);
    if (type === 'hours') {
      setHours(value);
    } else if (type === 'minutes') {
      setMinutes(value < 1 && hours === 0 ? 1 : value);
    } else if (type === 'seconds') {
      setSeconds(value);
    }
  };

  return (
    <div className="focus-timer-container"  ref={timerRef}>
      <h2>{isBreak ? 'Break Time' : 'Focus Session'}</h2>
  
      <div className="input-time">
        <input
          type="number"
          value={hours}
          onChange={(e) => handleTimeChange(e, 'hours')}
          placeholder="Hours"
        />
        <input
          type="number"
          value={minutes}
          onChange={(e) => handleTimeChange(e, 'minutes')}
          placeholder="Minutes"
        />
        <input
          type="number"
          value={seconds}
          onChange={(e) => handleTimeChange(e, 'seconds')}
          placeholder="Seconds"
        />
      </div>
  
      <div className="timer-display">
        <div class>{String(Math.floor(remainingTime / 3600)).padStart(2, '0')} </div>
        <div>{String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0')} </div>
        <div>{String(remainingTime % 60).padStart(2, '0')}</div>
      </div>
  
      <div>
        {!isActive ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleLeave}>Leave</button>
      </div>
    </div>
  );
  
};

export default FocusTimer;
