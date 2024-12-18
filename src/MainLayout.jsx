import React from "react";
import SideNav from "./components/SideNav";
import { Outlet } from "react-router-dom"; 

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
        <SideNav />

      <div className="flex-1 p-4">
        <Outlet /> 
      </div>
    </div>
  );
}

export default DashboardLayout;
