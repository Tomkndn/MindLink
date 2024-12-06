import React, { useState } from "react";
import MeetingForm from "../components/MeetingForm";

import { FaUser, FaCalendarAlt, FaClock, FaPlus } from "react-icons/fa";

function MeetingList() {
  // Sample data for meetings
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Project Kickoff",
      date: "2024-12-10",
      time: "10:00",
      type: "public",
      participants: [],
    },
    {
      id: 2,
      title: "Private Team Sync",
      date: "2024-12-12",
      time: "14:00",
      type: "private",
      participants: [
        { name: "Person 1", email: "Person1@example.com", response: "Accepted" },
        { name: "Person 2", email: "Person2@example.com", response: "Pending" },
        { name: "Person 3", email: "Person3@example.com", response: "Accepted" },
      ],
    },
    {
      id: 3,
      title: "Strategy Meeting",
      date: "2024-12-15",
      time: "09:00",
      type: "public",
      participants: [],
    },
  ]);
  const [showForm, setShowForm] = useState(false);

  // Handle new meeting scheduling
  const handleScheduleMeeting = (newMeeting) => {
    setMeetings((prevMeetings) => [
      ...prevMeetings,
      { ...newMeeting, id: prevMeetings.length + 1 },
    ]);
    setShowForm(false); // Hide the form after scheduling
  };

  return (
    
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-12">
      
      <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">
        Scheduled Meetings
      </h2>
       {/* Schedule New Meeting Button */}
       {!showForm && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-teal-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            New Meeting<FaPlus className="mr-2" />
          </button>
        </div>
      )}
       {/* Meeting Form */}
       {showForm && (
        <div className="mt-8">
          <MeetingForm onScheduleMeeting={handleScheduleMeeting} />
        </div>
      )}

      {/* Meeting List */}
      <div className="space-y-6">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform transform hover:scale-105"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-700">
                {meeting.title}
              </h3>
              <span
                className={`px-4 py-2 text-sm font-medium rounded-full text-white ${
                  meeting.type === "public" ? "bg-gray-500" : "bg-blue-500"
                }`}
              >
                {meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}
              </span>
            </div>

            <div className="text-gray-600 space-y-2">
              <p className="flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <strong>Date:</strong> {meeting.date}
              </p>
              <p className="flex items-center">
                <FaClock className="mr-2 text-gray-500" />
                <strong>Time:</strong> {meeting.time}
              </p>
            </div>

            {/* Private meeting participants */}
            {meeting.type === "private" && meeting.participants.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  Participants:
                </h4>
                <ul className="space-y-2">
                  {meeting.participants.map((participant, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                    >
                      <span className="flex items-center">
                        <FaUser className="mr-2 text-gray-500" />
                        {participant.name}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm rounded-md ${
                          participant.response === "Accepted"
                            ? "bg-green-600"
                            : "px-4 py-1 bg-yellow-600"
                        } text-white`}
                      >
                        {participant.response}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

     

     
    </div>
  );
}

export default MeetingList;


