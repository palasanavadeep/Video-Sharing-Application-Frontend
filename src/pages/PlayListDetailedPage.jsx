import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/InfiniteLoading/Loader.jsx";
import PlayListComponent from "../components/PlayListComponent.jsx";
import { useNavigate } from "react-router-dom";
import VideoCardListView from "../components/VideoCardListView";
import { useSelector } from "react-redux";
import DeleteAlert from "../utilities/DeleteAlert.jsx";

export default function PlayListDetailedPage() {
  const { playlistId } = useParams();
  //   const [isPlayListOwner, setIsPlayListOwner] = React.useState(false);
  const [playList, setPlayList] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [selectedVideo, setSelectedVideo] = React.useState(null); // for deleting video

  // popup states
  const [isPlaylistDeletePopupOpen, setIsPlaylistDeletePopupOpen] =
    React.useState(false);
  const [isPlaylistEditPopupOpen, setIsPlaylistEditPopupOpen] =
    React.useState(false);
  const [isVideoDeletePopupOpen, setIsVideoDeletePopupOpen] =
    React.useState(false);

  const loadPlayList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/playlist/${playlistId}/`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        setPlayList(response.data.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  function capitalizeWords(str) {
    return str
      .split(" ") // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // Join the words back into a single string
  }
  const handleEditPlayList = async ({ name, description }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_HOST}/api/playlist/${playlistId}/`,
        {
          name,
          description,
        },
        {
          withCredentials: true,
        }
      );
      if (response) {
        // loadPlayList();
        setPlayList((prev) => {
          return { ...prev, name, description };
        });
      }
    } catch (e) {
      console.log("Error Editing Playlist", e);
    } finally {
      setIsPlaylistEditPopupOpen((prev) => !prev);
    }
  };
  const handleDeletePlayList = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_HOST}/api/playlist/${playlistId}/`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        navigate("/playlists");
      }
    } catch (e) {
      console.log("Error Deleting Playlist", e);
    } finally {
      setIsPlaylistDeletePopupOpen((prev) => !prev);
    }
  };
  const handleDeleteVideoFromPlayList = async (videoId) => {
    // console.log("Deleting Video", videoId);
    // setIsVideoDeletePopupOpen((prev) => !prev);
    // playList.videos = playList.videos.filter((video) => video._id !== videoId);
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_HOST}/api/playlist/remove/${videoId}/${playList._id}`,{},
            {
            withCredentials: true,
            }
        );
        if (response) {
            setPlayList(playList => (
                {
                    ...playList , 
                    videos : playList.videos.filter(video => video._id !== videoId)
                }
            ));
            
        }
        } catch (e) {
        console.log("Error Deleting Video", e);
        } finally {
        setIsVideoDeletePopupOpen((prev) => !prev);
        setSelectedVideo(null);
    }
  };

  useEffect(() => {
    if (playlistId) {
      loadPlayList();
    }
  }, [playlistId]);

  //   console.log(userData);

  return loading && !playList?._id ? (
    <Loader />
  ) : (
    <div className="flex  flex-wrap w-full text-white bg-gray-700 h-screen ">
      {/* Left  */}
      <div className="w-full md:w-1/3 bg-gray-700 min-h-80 border-r-1 border-gray-700">
        <PlayListComponent
          playlistId={playList._id}
          name={playList.name}
          description={playList.description}
          totalVideos={playList.videos.length}
          owner={playList.owner}
          updatedAt={playList.updatedAt}
          videos={playList.videos}
        />

        {/* Actions */}
        {userData._id === playList.owner._id && (
          <div>
            <h1 className=" text-gray-200 text-center font-extrabold  mt-4 p-2">
              Actions
            </h1>
            <div className="flex justify-between bg-gray-800 w-full rounded-md shadow-md space-x-2 p-2">
              {/* <h1 className='h-10 p-2 pl-4 font-bold font-mono '> PlayList Videos </h1>  */}
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md font-mono active:scale-95"
                onClick={() => setIsPlaylistEditPopupOpen((prev) => !prev)}
              >
                Edit PlayList
              </button>
              {/* Edit Popup */}
              {isPlaylistEditPopupOpen && (
                <EditPlayList
                  oldName={playList.name}
                  oldDescription={playList.description}
                  onCancel={() => setIsPlaylistEditPopupOpen((prev) => !prev)}
                  onSave={handleEditPlayList}
                />
              )}
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md font-mono active:scale-95"
                onClick={() => setIsPlaylistDeletePopupOpen((prev) => !prev)}
              >
                Delete PlayList
              </button>
              {/* Delete POpup */}
              {isPlaylistDeletePopupOpen && (
                <DeleteAlert
                  message={`Are you sure you want to Delete PlayList -- ${playList.name} ?`}
                  onConfirm={handleDeletePlayList}
                  onCancel={() => setIsPlaylistDeletePopupOpen((prev) => !prev)}
                />
              )}
            </div>
          </div>
        )}

        {/* Playlist Owner */}
        <h1 className=" text-gray-200 text-center font-extrabold  p-2">
          PlayList Owner{" "}
        </h1>
        <div className="bg-gray-800 flex text-white rounded-lg shadow-md p-4 mb-3">
          <div>
            <img
              className="w-20 h-20 rounded-full object-cover"
              src={playList.owner.avatar}
              alt=" avatar"
            />
          </div>
          <div className="ml-4 pt-2 text-2xl items-center">
            <div
              onClick={() =>
                navigate(`/channel-profile/${playList.owner._id}/videos`)
              }
              className="hover:scale-105 hover:cursor-pointer active:scale-x-95"
            >
              <h1 className="text-blue-500">
                {capitalizeWords(playList.owner.username)}
              </h1>
            </div>
            <h2 className="text-lg text-gray-300">
              {capitalizeWords(playList.owner.fullName)}
            </h2>
          </div>
        </div>
      </div>
      {/*  Right  */}
      <div className="w-full md:w-2/3 bg-gray-900 min-h-80 ">
        <div className="flex flex-wrap bg-gray-800 w-full ">
          <h1 className="h-10 p-4 pl-4 font-bold font-mono  ">
            PlayList Videos
          </h1>
          <button 
          disabled={!selectedVideo}
          onClick={() => setIsVideoDeletePopupOpen((prev) => !prev)}
          className={`text-white p-2 rounded-md font-mono  m-2  ml-auto  active:scale-95 
          ${selectedVideo ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}`}>
            Delete Video 
          </button>
            {isVideoDeletePopupOpen && (
            <DeleteAlert
                message={`Are you sure you want to Delete Video from this PlayList? ${selectedVideo}`}
                onConfirm={() => handleDeleteVideoFromPlayList(selectedVideo)}
                onCancel={() => setIsVideoDeletePopupOpen((prev) => !prev)}
            />
            )}
        </div>
        {playList.videos.map((video) => {
          return (
            <div
              key={video._id}
              className="flex p-2 rounded items-center justify-center"
            >
                <input 
                type="checkbox" 
                className="h-6 w-6 m-2"
                checked={selectedVideo === video._id}
                onChange={() => setSelectedVideo((prev) => prev === video._id ? null : video._id)}
                 />
                <VideoCardListView video={video} />
            </div>
          );
        })}
      </div>
    </div>
  );
}


function EditPlayList({ oldName, oldDescription, onCancel, onSave }) {
  const [name, setName] = React.useState(oldName);
  const [description, setDescription] = React.useState(oldDescription);

  const handleSave = () => {
    onSave({ name, description });
  };

  return (
    <div className="fixed -inset-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-400"
          onClick={onCancel}
        >
          ✕
        </button>
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-300 mb-4">Edit Playlist</h2>
        {/* Name Input */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm  bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter playlist Name"
          />
        </div>
        {/* Description Input */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter playlist description"
            rows="4"
          ></textarea>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400 active:scale-95"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:scale-95"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

{/* <VideoCardListView video={video} />; */}
