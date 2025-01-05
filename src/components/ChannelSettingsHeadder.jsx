import React from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./InfiniteLoading/Loader";
import { useNavigate } from "react-router-dom";

function ChannelSettingsHeadder() {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadChannel = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/user/current-user`,{
          withCredentials: true,
        }
      );
      // console.log(response);
      
      if (response.data.success) {
        setChannel(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load channel", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannel();
  }, []);

  const isActive = ({ isActive }) =>
    `flex-1 py-3 ${
      isActive
        ? "border-b-4 border-purple-500 text-purple-500 font-semibold bg-purple-300 rounded-sm text-white"
        : "text-gray-300"
    }`;

  return loading || !channel ? (
    <Loader />
  ) : (
    <div className="bg-black shadow-lg w-full ">
      {/* Header Section */}
      <div className="p-6 flex items-center border-b">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
          <img
            src={channel.avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold  text-gray-300">{channel.fullName}</h2>
          <p className="text-gray-400">@ {channel.username}</p>
        </div>
        <button 
        onClick={()=> navigate(`/channel-profile/${channel._id}/videos`)}
        className="ml-auto bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          View Channel
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b text-center">
        <NavLink to="/channel-settings/personal-info" className={isActive}>
          Personal Information
        </NavLink>
        <NavLink to="/channel-settings/channel-info" className={isActive}>
          Channel Information
        </NavLink>
        <NavLink to="/channel-settings/change-password" className={isActive}>
          Change Password
        </NavLink>
      </div>
    </div>
  );
}

export default ChannelSettingsHeadder;
