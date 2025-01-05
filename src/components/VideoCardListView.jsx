import React from "react";
import { calculateTimeDifference } from "../utilities/calculateTimeDifference";
import { Link } from "react-router-dom";

const VideoCardListView = ({ video }) => {
  return (
    <Link to={`/watch/${video._id}`} className="flex items-center space-x-4">
        <div className="grid grid-cols-3 bg-gray-800 border-2
         border-gray-900 shadow-2xl text-white p-1 rounded-lg gap-4 hover:bg-gray-700">
      {/* Thumbnail Section (1/3 width) */}
      <div className="relative">
        <img
          src={video.thumbnail}
          alt="Video Thumbnail"
          className="w-full h-full rounded-lg object-cover"
        />
        {/* Video Duration */}
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration.toFixed(2)}
        </div>
      </div>
      {/* Video Details (2/3 width) */}
      <div className="col-span-2 flex flex-col justify-between">
        {/* Title */}
        <h2 className="text-lg font-bold line-clamp-2 overflow-hidden">
          {video.title}
        </h2>
        {/* Views and Created At */}
        <p className="text-sm text-gray-400">
          {video.views} Views · {calculateTimeDifference(video.createdAt)}
        </p>
        {/* Owner */}
        <div className="flex items-center space-x-2 pt-1">
          <img
            src={video.owner.avatar}
            alt="Owner Avatar"
            className="w-7 h-7 rounded-full object-cover"
          />
          <p className="text-sm font-medium">{video.owner.username}</p>
        </div>
      </div>
    </div>
     </Link>
  );
};

export default VideoCardListView;
