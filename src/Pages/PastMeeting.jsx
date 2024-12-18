import { CgProfile } from "react-icons/cg";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Dummy data for past meetings
// const meetings = [
//   {
//     id: 1,
//     heading: "Design Team Sync",
//     owner: "Rohit Mondal",
//     publishedDate: "2024-11-15",
//     time: "10:00 AM",
//     importantInfo: "Discussed new design updates and roadmap.",
//     sharedResources: [
//       { fileName: "DesignDocument.pdf", owner: "Rohit Mondal" },
//     ],
//   },
//   {
//     id: 2,
//     heading: "Development Review",
//     owner: "Kartik Kapahi",
//     publishedDate: "2024-11-12",
//     time: "03:00 PM",
//     importantInfo: "Reviewed sprint progress and tasks.",
//     sharedResources: [
//       { fileName: "SprintTasks.xlsx", owner: "Kartik Kapahi" },
//     ],
//   },
//   {
//     id: 3,
//     heading: "Marketing Strategy Meeting",
//     owner: "Steve Rogers",
//     publishedDate: "2024-11-10",
//     time: "02:00 PM",
//     importantInfo: "Defined goals for Q1 marketing campaigns.",
//     sharedResources: [
//       { fileName: "MarketingPlan.pptx", owner: "Steve Rogers" },
//     ],
//   },
// ];

const PastMeeting = () => {
  const [isSharedResourcesOpen, setIsSharedResourcesOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/meeting/recentmeetings");
        console.log(response.data);
        
        if (Array.isArray(response.data)) {
          setMeetings(response.data); 
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch meetings");
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleSharedResourcesClick = (resources) => {
    setSelectedResources(resources || []);
    setIsSharedResourcesOpen(true);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-blue-100 to-teal-100 p-6 min-h-screen flex justify-center items-center">
      {/* Main Container */}
      <div
        className={`w-full max-w-5xl flex transition-all duration-500 ${
          isSharedResourcesOpen ? "justify-between" : "justify-center"
        }`}
      >
        {/* Past Meetings Section */}
        <div
          className={`bg-white p-6 mr-1 rounded-lg shadow-xl transform transition-transform duration-500 ${
            isSharedResourcesOpen ? "w-[60%]" : "w-full "
          }`}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            Past Meetings
          </h1>
            {!loading && !error &&
            (
          <div className="space-y-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl hover:text-blue-700 transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{meeting.title}</h2>
                  <div className="flex items-center">
                    <CgProfile className="text-2xl text-indigo-600" />
                    <p className="ml-2 text-lg text-green-600 cursor-pointer hover:text-blue-700">
                      {meeting?.organizer?.username}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-[-0px]">
                  <span>Start In: <span className="text-red-500"> {meeting.time}</span></span>
                  <span>{new Date(meeting.date).toLocaleDateString()}</span>

                </div>
                <p className="text-gray-700 mt-3">{meeting.description}</p>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleSharedResourcesClick(meeting.sharedResources)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                     Resources
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) }
        </div>

        {/* Shared Resources Section */}
        {isSharedResourcesOpen && (
          <div
            className={`bg-white p-6 rounded-lg shadow-xl w-[40%] transform transition-all duration-500`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Shared Resources</h2>
              <button
                onClick={() => setIsSharedResourcesOpen(false)}
                className="text-red-600 font-semibold hover:underline"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {selectedResources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center">
                    <CgProfile className="text-3xl text-indigo-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium">{resource.owner}</p>
                      <p className="text-xs text-gray-600">
                        {resource.fileName}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() => alert(`Downloading ${resource.fileName}`)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastMeeting;
