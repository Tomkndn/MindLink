import React from "react";
import { Camera, UserCircle } from "lucide-react";

const ProfileHeader = ({ user, onImageUpdate })=>{
  return (
    <div className="relative">
      <div className="h-36 relative group">
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="relative group">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
              <UserCircle className="w-20 h-20 text-gray-400" />
            </div>
          )}
          <button
            onClick={() => {
              const url = window.prompt("Enter profile image URL:");
              if (url) onImageUpdate(url);
            }}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;