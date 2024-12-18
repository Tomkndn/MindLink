import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


const JoinPage = () => {
    const [value, setValue] = useState();

    const navigate = useNavigate();

    const handleJoinRoom = useCallback(() => {
        navigate(`/RoomPage/${value}`);
    }, [navigate, value]);

    return (
        <div className='page'>
               
            <div className='RoomCode'>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="text"
                    placeholder="Create Room Code"
                />
                <br />
                <button className='join-btn' onClick={handleJoinRoom}>Join</button>
            </div>
        </div>
    );
};

export default JoinPage;