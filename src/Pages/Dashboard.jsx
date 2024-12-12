import React from 'react'
import SideNav from '../components/SideNav'
import DashMain from '../components/DashMain'
import '../Dashboard.css'
function Dashboard() {
  return (
    <>
    <div className='dashboard-section'>
      <SideNav />
      <DashMain/>
    </div>
    </>
  )
}

export default Dashboard
