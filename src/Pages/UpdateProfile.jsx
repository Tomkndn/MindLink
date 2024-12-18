import React,{useEffect, useState} from "react";
import ProfileHeader from "../components/ProfileHeader";
import EditableField from "../components/EditableField";
import SkillsSection from "../components/SkillsSection";
import { Save, X } from "lucide-react";
import useStore from "../store/useStore";
import Loading from "../components/Loading";
import axiosInstance from "./../store/axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";
import { useChatState } from "../context/ChatProvider";

const UpadteProfile = () => {
  const { user: res, updateProfile } = useStore();
  const [user, setUser] = useState();
  const [tempUser, setTempUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [groups, setgroups] = useState([]);
  const [chats, setChats] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchId = async () => {
      try {
        if (!res.id) {
          throw new Error("User ID not found");
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${res.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setUser(data);
        setTempUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    fetchId();
  }, []);

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/group/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const limitedGroups = response.data;
          setgroups(limitedGroups);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    fetchAllGroups();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axiosInstance.get("/api/chat", config);
        setChats(data);
      } catch (error) {
        toast.warning("Failed to fetch chats.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "colored",
        });
        return;
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("You are not logged in. Please log in first.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/meeting/upcomingmeetings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response data:", response.data);
        setMeetings(response.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        alert("Failed to load meetings. Please try again later.");
      }
    };
    fetchMeetings();
  }, []);

  const handleFieldUpdate = (field) => (value) => {
    setTempUser((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
    setIsEditing(true);
  };

  const handleSkillsUpdate = (skills) => {
    setTempUser((prev) => ({
      ...prev,
      skills,
      updatedAt: new Date().toISOString(),
    }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!tempUser.skills || tempUser.skills.length === 0) {
        toast.error("Skills array must contain at least one skill.", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setIsSaving(false);
        return;
      }

      if (!tempUser.gender || tempUser.gender.trim() === "") {
        toast.error("Gender cannot be empty.", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setIsSaving(false);
        return;
      }

      if (!tempUser.profileImage) {
        toast.error("Profile Image cannot be empty.", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setIsSaving(false);
        return;
      }

      if (!tempUser.collegeOrSchool || tempUser.collegeOrSchool.trim() === "") {
        toast.error("College cannot be empty.", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setIsSaving(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${res.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(tempUser),
        }
      );
      const data = await response.json();
      if (data)
        toast.success("Changes saved successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
      const updatedUser = {
        ...user,
        ...data,
      };
      setUser(updatedUser);

      if (
        updatedUser.collegeOrSchool &&
        updatedUser.gender &&
        updatedUser.profileImage &&
        updatedUser.skills.length > 0
      ) {
        updateProfile();
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Error saving changes", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-indigo-300">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto pb-12">
          <ProfileHeader
            user={tempUser}
            onImageUpdate={handleFieldUpdate("profileImage")}
          />

          <div className="mt-20 mx-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <EditableField
                    label="Username"
                    value={tempUser.username}
                    onSave={handleFieldUpdate("username")}
                  />
                  <EditableField
                    label="Email"
                    value={tempUser.email}
                    onSave={handleFieldUpdate("email")}
                  />
                  <EditableField
                    label="College/School"
                    value={tempUser.collegeOrSchool}
                    onSave={handleFieldUpdate("collegeOrSchool")}
                  />
                  <EditableField
                    label="Gender"
                    value={tempUser.gender}
                    onSave={handleFieldUpdate("gender")}
                  />
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <SkillsSection
                    skills={tempUser.skills}
                    onUpdate={handleSkillsUpdate}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {groups.length}
                    </div>
                    <div className="text-sm text-gray-500">Groups</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {meetings.length}
                    </div>
                    <div className="text-sm text-gray-500">Meetings</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {chats.length}
                    </div>
                    <div className="text-sm text-gray-500">Chats</div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpadteProfile;