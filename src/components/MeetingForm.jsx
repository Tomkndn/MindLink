import React, { useState } from "react";
import axios from "axios";  // Import Axios

function MeetingForm({ onScheduleMeeting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "public",
    password: "", // Added for private meetings
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Displaying the meeting details in the console
    console.log("Meeting Details:", formData);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      // Sending POST request with formData to the server
      const response = await axios.post("http://localhost:5000/meeting/meet", 
      {title: formData.title, description:formData.description , date : formData.date, time : formData.time , privacy : formData.type},
      { headers: { Authorization: `Bearer ${token}` } });

      if(response.status === 201){
        alert("Meeting scheduled successfully!"); 
      console.log("Meeting scheduled successfully:", response.data);
      }

      // Optionally, you can call the parent component's function if needed
      if (onScheduleMeeting) {
        onScheduleMeeting(response.data);
      }

    } catch (error) {
      console.error("There was an error scheduling the meeting:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-center text-3xl font-semibold mb-4">Schedule a Meeting</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
            Meeting Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter meeting title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter meeting description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-gray-700 font-medium mb-1">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Type</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="public"
                checked={formData.type === "public"}
                onChange={handleInputChange}
                className="mr-2"
              />
              Public
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="private"
                checked={formData.type === "private"}
                onChange={handleInputChange}
                className="mr-2"
              />
              Private
            </label>
          </div>
        </div>

        {formData.type === "private" && (
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Meeting Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter meeting password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-black-600 transition"
          >
            Schedule Meeting
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeetingForm;
