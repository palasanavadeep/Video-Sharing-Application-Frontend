import React from "react";
import { useNavigate } from "react-router-dom";
import{calculateTimeDifference} from '../utilities/calculateTimeDifference.js'

function VideoCard({ video }) {
  const navigate = useNavigate();
  // console.log(thumbnail);

  const handleVideoClick = () => {
    // console.log("Video clicked", video._id);
    navigate("/watch/" + video._id);
  };

  // const postedAt = calculateTimeDifference(video.createdAt).toString();

  return (
    <div
      onClick={handleVideoClick}
      className="max-w-sm mx-1 bg-gray-800 text-white rounded-lg shadow-md overflow-hidden hover:bg-gray-900 cursor-pointer active:bg-gray-600 active:scale-95"
    >
      <div className="relative justify-center items-center"> 
        <img
          src={`${video.thumbnail}`}
          alt="Video Thumbnail"
          className="w-full object-cover min-h-52 max-h-60 justify-center text-center "
        />
        <span className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 text-white text-sm font-semibold px-2 py-1 rounded">
          {video.duration.toFixed(2)}
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold leading-tight">
          {video.title}
        </h2>
        <div className="text-sm text-gray-400 mt-2">
          <span>{video.views} Views</span>
          <span className="mx-1">•</span>
          <span>{calculateTimeDifference(video.createdAt)}</span>
        </div>
        <div className="flex mt-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 mr-2">
            <img
              src={`${video.owner.avatar}`}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium text-gray-300">{video.owner.username}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
