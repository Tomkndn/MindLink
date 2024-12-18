import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FocusSessionChart = () => {
  const [focusSessions, setFocusSessions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [], // Dates
    datasets: [{
      label: 'Focus Minutes per Day',
      data: [], // Total minutes of focus per day
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    const fetchFocusSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/focus-session/getsession', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if(response.status === 200){
            console.log('Focus sessions fetched successfully');
            setFocusSessions(response.data); // Assuming response.data contains the focus sessions
        }
      } catch (error) {
        console.error('Error fetching focus sessions:', error);
      }
    };

    fetchFocusSessions();
  }, []);

  useEffect(() => {
    if (focusSessions.length === 0) return;

    // Define your start date for filtering (e.g., 7 days ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);  // 7 days ago

    // Get current date
    const currentDate = new Date();

    // Filter the focus sessions by date range (from startDate to currentDate)
    const filteredSessions = focusSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= currentDate;
    });

    // Helper function to convert HH:MM:SS to minutes
    const convertToMinutes = (duration) => {
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      return hours * 60 + minutes + (seconds / 60);
    };

    // Aggregate total minutes of focus per date
    const totalFocusMinutesByDate = filteredSessions.reduce((acc, session) => {
      const sessionDate = new Date(session.date).toLocaleDateString(); // Format to MM/DD/YYYY
      const sessionMinutes = convertToMinutes(session.duration);

      acc[sessionDate] = acc[sessionDate] ? acc[sessionDate] + sessionMinutes : sessionMinutes;
      return acc;
    }, {});

    // Prepare chart data
    const dates = Object.keys(totalFocusMinutesByDate);
    const focusMinutes = Object.values(totalFocusMinutesByDate);

    // Update chart data state
    setChartData({
      labels: dates,
      datasets: [{
        label: 'Focus Minutes per Day',
        data: focusMinutes,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    });
  }, [focusSessions]);

  return (
    <div className="chart-container">
      {/* <h2>Focus Minutes from Last 7 Days</h2> */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Focus Minutes per Day'
            },
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Total Focus Minutes'
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default FocusSessionChart;
