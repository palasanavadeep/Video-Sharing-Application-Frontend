import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChannelSubscriptionsCard({ channelId, avatar, username, fullName }) {
  const navigate = useNavigate();

  const [subscribed, setSubscribed] = React.useState(true);

  const onUnsubscribe = async (channelId) => {
    axios
      .post(`${import.meta.env.VITE_HOST}/api/subscription/c/${channelId}`, {},{
        withCredentials: true,
      })
      .then((response) => {
        if (!response) {
          console.error("ERROR :: In Unsubscribing the Channel.");
          console.log(response);
        }
        setSubscribed((prev) => !prev);
        // console.log("Channel subscribed / toggled  Successfully.");
      })
      .catch((e) => {
        console.error("ERROR :: In Unsubscribing the Channel.");
        console.log(e);
      });
  };
  const onViewChannel = async (channelId) => {
    navigate(`/channel-profile/${channelId}/videos`);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 w-full mb-4 transition-colors">
      {/* Left Section: Avatar and Info */}
      <div className="flex items-center">
        <div className="mr-4">
          <img
            src={avatar}
            alt={`${username}'s avatar`}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg text-white font-semibold">{username}</h3>
          <p className="text-sm text-white">{fullName}</p>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onUnsubscribe(channelId)}
          className={
            !subscribed
              ? "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
              : "bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
          }
        >
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </button>
        <button
          onClick={()=> onViewChannel(channelId)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
        >
          View Channel
        </button>
      </div>
    </div>
  );
}

export default ChannelSubscriptionsCard;
