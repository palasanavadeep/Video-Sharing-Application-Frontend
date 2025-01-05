import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { calculateTimeDifference } from '../utilities/calculateTimeDifference';

function SubscriberCard({ channelId , avatar, username, fullName, createdAt}) {

    // console.log("Subscriber Card : "+channelId);
    // console.log("avatar : "+avatar);
    // console.log("username : "+username);
    // console.log("fullName : "+fullName);
    
    

    const navigate = useNavigate();

    const onViewChannel = async(channelId) => {
        // navigate(`/channel/${channelId}`);
    }

    return (
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 w-full mb-4 transition-colors">
        {/* Left Section: Avatar and Info */}
        <div className="flex items-center">
          <div className="mr-4">
            <img src={avatar} alt={`${username}'s avatar`} className="w-16 h-16 rounded-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg text-white font-semibold">{username}</h3>
            <p className="text-sm text-white">{fullName}</p>
          </div>
        </div>
  
        {/* Right Section: Buttons */}
        <div className="flex items-center space-x-4">
            <div className='text-lg text-bold text-white px-4'>
                Subscribed {calculateTimeDifference(createdAt)}
            </div>
          <button
            onClick={()=> navigate(`/channel-profile/${channelId}/videos`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            View Channel
          </button>
        </div>
      </div>
    );
  }


export default SubscriberCard
