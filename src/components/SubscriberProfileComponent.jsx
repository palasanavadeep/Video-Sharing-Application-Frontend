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
    <div className="bg-gray-800 text-white p-2 rounded-lg flex items-center gap-3 w-full md:p-4 md:gap-4">
      <img
        src={avatar}
        alt={`Subscriber Avatar`}
        className="size-12 md:size-16 rounded-full border-2 border-purple-500"
      />
      <div className="flex-1 ">
        <h3 className="text-md md:text-lg font-bold">{fullName}</h3>
        <div className="text-gray-400">
          <p className="hidden md:block">{username} • Subscribed </p>
          {calculateTimeDifference(subscribedSince)}
        </div>
      </div>
      <button
        onClick={() => navigate(`/channel-profile/${channelId}/videos`)}
        className={`p-2 md:px-4 md:py-2 rounded-lg md:font-medium transition-colors bg-purple-500 hover:bg-purple-600 `}
      >
        View Channel
      </button>
    </div>
  );
}

export default SubscriberProfileComponent;
