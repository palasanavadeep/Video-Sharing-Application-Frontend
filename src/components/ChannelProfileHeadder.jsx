import React from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ChannelProfileHeadder() {

  const channelId = useParams().channelId;
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);

  const userData = useSelector((state) => state.user.userData);

  const loadProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/user/c/${channelId}`,
        {
          withCredentials: true,
        }

      );

      if(!response.data.success){
        console.error("Error fetching channel profile:", response.data.message);

      }else{
        // console.log(response.data.data);
        
        setChannel(response.data.data);
      }

    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadProfile();
    if(!channel){
      console.error(channel);
      return;
    }
    setLoading(false);

  }, [channelId,loading]);

  const isActive = ({ isActive }) =>
    `flex-1 py-3 ${
      isActive
        ? "border-b-4 border-purple-500 text-purple-500 font-semibold bg-purple-200 rounded-sm"
        : "text-gray-300"
    }`;

  const toggleSubscription = async () => {

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/subscription/c/${channel._id}/`,
        {},
        {
          withCredentials: true,
        }
      );

      if(!response.data.success){
        console.error("Error subscribing to channel:", response.data.message);

      }else{
        // console.log(response.data.data);
        // setChannel((prev)=> ({...prev, isSubscribed: !prev.isSubscribed}));
        const {subscribersCount, isSubscribed} = channel;
        const updatedSubscribersCount = isSubscribed ? subscribersCount-1 : subscribersCount+1;
        const updatedIsSubscribed = !isSubscribed 
        setChannel((prev)=> ({
          ...prev, 
          subscribersCount: updatedSubscribersCount,
          isSubscribed: updatedIsSubscribed,
        }));
      }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="bg-black shadow-lg w-full">
      {/* Header Section */}
      {/* Cover Image */}
      <div className="w-full h-32 rounded-sm overflow-hidden border border-gray-500">
          <img
            src={channel.coverImage}
            alt="Cover Image"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Avatar */}
      <div className="p-6 flex items-center ">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-700">
          <img
            src={channel.avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold text-white">{channel.fullName}</h2>
          <p className="text-white">@{channel.username}</p>
          <h6 className="text-white">
          {`${channel.subscribersCount} ${channel.subscribersCount != 1 ? "Subscribers" : "Subscriber"}   
          .  ${channel.subscribedToCount} Subscribed`}
          </h6>
        </div>
        
        {userData?._id !== channelId && 
        <button 
        className={`ml-auto mr-16  text-white px-4 py-2 rounded-lg ${
          channel.isSubscribed
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-purple-500 hover:bg-purple-700"
        }`}
        onClick={toggleSubscription}
        >
          {channel.isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b text-center">
        <NavLink to={`/channel-profile/${channelId}/videos`} className={isActive}>
          Videos
        </NavLink>
        <NavLink to={`/channel-profile/${channelId}/play-lists`} className={isActive} end>
          Play Lists
        </NavLink>
        <NavLink to={`/channel-profile/${channelId}/tweets`} className={isActive}>
          Tweets
        </NavLink>
        <NavLink to={`/channel-profile/${channelId}/subscribed-channels`} className={isActive}>
          Subscribed
        </NavLink>
      </div>
    </div>
  );
}

export default ChannelProfileHeadder;
