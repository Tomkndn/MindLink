import React, { useState, useEffect } from "react";
import axios from "axios";
import MeetingForm from "../components/MeetingForm";
import { FaUser, FaCalendarAlt, FaClock, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MeetingList() {
  const [meetings, setMeetings] = useState([]); // State to hold fetched meetings
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState(null); // State for storing the logged-in user's ID
  const [inviteEmail, setInviteEmail] = useState(""); // State to manage the email input for invitations
  const navigate = useNavigate();

  // Function to fetch meetings data
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        alert("You are not logged in. Please log in first.");
        return;
      }

      // Decode the token or fetch user data to get the user ID (example assuming it's embedded in the token)
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token (if JWT format)
      setUserId(decodedToken.id); // Set user ID from token
      console.log(decodedToken.id);

      const response = await axios.get("http://localhost:5000/meeting/upcomingmeetings", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in Authorization header
        },
      });

      console.log('Response data:', response.data);
      setMeetings(response.data); // Assuming the response contains an array of meetings
    } catch (error) {
      console.error("Error fetching meetings:", error);
      alert("Failed to load meetings. Please try again later.");
    }
  };

  // Function to handle meeting invitation
  const handleInvite = async (meetingId) => {
    if (inviteEmail.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }

    

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/meeting/invitation/${meetingId}`,
        { email: inviteEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Invitation sent successfully!");
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation. Please try again later.");
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-12">
      <h2 className="text-center text-4xl font-bold text-gray-800 mb-8">
        Scheduled Meetings
      </h2>
      {!showForm && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-teal-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            New Meeting <FaPlus className="ml-2" />
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-8">
          <MeetingForm  />
        </div>
      )}

      <div className="space-y-6">
        {meetings.length === 0 ? (
          <p className="text-center text-gray-500">No meetings scheduled yet.</p>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting._id}
              className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform transform hover:scale-105 ${
                meeting.organizer._id === userId ? "bg-teal-100 border-teal-500" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-700">
                  {meeting.title}
                </h3>
                <span
                  className={`px-4 py-2 text-sm font-medium rounded-full text-white ${
                    meeting.privacy === "public" ? "bg-blue-500" : "bg-blue-700"
                  }`}
                >
                  {meeting.privacy
                    ? meeting.privacy.charAt(0).toUpperCase() +
                      meeting.privacy.slice(1)
                    : "Unknown"}
                </span>
              </div>

              <div className="text-gray-600 space-y-2">
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <strong>Date:</strong> {new Date(meeting.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="flex items-center">
                  <FaClock className="mr-2 text-gray-500" />
                  <strong>Time:</strong> {meeting.time}
                </p>
              </div>

              {meeting.privacy === "private" &&
                meeting.organizer._id === userId && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Invite Participants:
                    </h4>
                    <input
                      type="email"
                      className="px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter email to invite"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <button
                      onClick={() => handleInvite(meeting._id)}
                      className="ml-4 px-6 py-2 bg-teal-600 text-white font-semibold rounded-md"
                    >
                      Invite
                    </button>
                  </div>
                )}

              {meeting.privacy === "public" && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Invite Participants:
                  </h4>
                  <input
                    type="email"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter email to invite"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <button
                    onClick={() => handleInvite(meeting._id)}
                    className="ml-4 px-6 py-2 bg-teal-600 text-white font-semibold rounded-md"
                  >
                    Invite
                  </button>
                </div>
              )}

              {meeting.privacy === "private" &&
                meeting.participants.length > 0 && (
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
                          <div className="flex items-center">
                            <FaUser className="mr-2 text-gray-500" />
                            <span>{participant.username.username}</span>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm rounded-md ${
                              participant.response === "Accepted"
                                ? "bg-green-600"
                                : "bg-yellow-600"
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
          ))
        )}
      </div>
    </div>
  );
}

export default MeetingList;