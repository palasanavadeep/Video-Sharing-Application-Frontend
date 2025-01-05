import React from "react";
import {calculateTimeDifference} from "../utilities/calculateTimeDifference";
import {useNavigate} from "react-router-dom";
// import { useSelector }  from "../../public/"

function PlayListComponent({ playlistId, name, description, totalVideos, owner, updatedAt, videos }) {

  const navigate = useNavigate();
  const getPlayListImage = () => {
    // const randomNumber = Math.floor(Math.random() * totalVideos);
    // return videos[randomNumber].thumbnail;
    if(videos.length > 0){
      return videos[0].thumbnail;
    }else{
      return "../../public/EmptyPlaylistImage.jpeg";
    }

  };

  // console.log(typeof totalVideos);
  
  
  return (
    <div 
    className={` bg-gray-800 text-white rounded-lg shadow-md overflow-hidden
       hover:bg-gray-900 cursor-pointer transform transition-transform duration-300 hover:scale-105`}
    onClick={() => navigate(`/playlist/${playlistId}`)}
    >
      <div className="relative">
        <img
          src={getPlayListImage()}
          alt="Thumbnail"
          className="w-full object-cover max-h-56 min-w-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="absolute bottom-4 left-4">
            <p className="text-sm font-semibold">Playlist</p>
            <p className="text-xs text-gray-400">
              Updated · {calculateTimeDifference(updatedAt)}</p>
          </div>
          <p className="absolute bottom-4 right-4 text-sm bg-gray-800 bg-opacity-75 px-2 py-1 rounded">
           {totalVideos === 1 ? `${totalVideos} Video` : `${totalVideos} Videos`}
          </p>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-md text-gray-300 mt-2">
          {description}
        </p>
      </div>
    </div>
  );
}


export default PlayListComponent;
