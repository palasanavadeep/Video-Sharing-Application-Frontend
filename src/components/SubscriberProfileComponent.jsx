import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateTimeDifference } from "../utilities/calculateTimeDifference";


function SubscriberProfileComponent({ 
  subscribedSince ,
   avatar ,
    username ,
     fullName ,
      channelId }) {
  
    const navigate = useNavigate();

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center gap-4 w-full ">
      <img
        src={avatar}
        alt={`Subscriber Avatar`}
        className="w-16 h-16 rounded-full border-2 border-purple-500"
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold">{fullName}</h3>
        <p className="text-gray-400">
          {username} • Subscribed {calculateTimeDifference(subscribedSince)}
        </p>
      </div>
      <button
        onClick={() => navigate(`/channel-profile/${channelId}/videos`)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors bg-purple-500 hover:bg-purple-600`}
      >
        View Channel
      </button>
    </div>
  );
}

export default SubscriberProfileComponent;
