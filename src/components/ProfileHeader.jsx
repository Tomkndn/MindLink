import React, { useState } from "react";
import { Camera, Loader2, UserCircle } from "lucide-react";

const ProfileHeader = ({ user, onImageUpdate }) => {
  
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("username", user.username); 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      onImageUpdate(data.imageUrl); 
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="h-36 relative group"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            ) : (
              user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ): (
                <UserCircle className="w-20 h-20 text-gray-400" />
              )
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-5 w-5 text-gray-600" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;