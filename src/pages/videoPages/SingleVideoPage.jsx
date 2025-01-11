import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentCard from "../../components/CommentCard.jsx";
import { calculateTimeDifference } from "../../utilities/calculateTimeDifference.js";
import Loader from "../../components/InfiniteLoading/Loader.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoCardListView from "../../components/VideoCardListView.jsx";
import { showAlertFromErrorHtml } from "../../utilities/formatApiError.js";

export default function SingleVideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadVideoData = async () => {
    try {
      // Fetch video details
      const videoResponse = await axios.get(
        `${import.meta.env.VITE_HOST}/api/video/${videoId}`,
        { withCredentials: true }
      );
      const videoData =
        videoResponse && videoResponse.data.data.length > 0
          ? videoResponse.data.data[0]
          : null;

      setVideo(videoData);

      // Fetch video owner's details
    } catch (error) {
      console.error("Error loading video or owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideoData();
    // console.log(video);
  }, [videoId]);

  if (loading) {
    return <Loader />;
  }

  // console.log(videoOwner);

  return (
    <div className="flex flex-col md:flex-row h-auto border-2 border-gray-700">
      {/* Left Section */}
      <div className="w-full md:w-2/3 bg-gray-900 flex flex-col items-center p-2 border-r-2 border-gray-700">
        {/* Video Section */}
        <div className="relative w-full h-64 md:h-3/4">
          {video ? (
            <video
              className="w-full h-full object-cover rounded-lg"
              src={video.videoFile}
              controls
              autoPlay
            ></video>
          ) : (
            <Loader />
          )}
        </div>

        {/* Video Details */}
        <div className="p-1 bg-gray-800 space-y-4 border-2 border-gray-500 m-4 w-full rounded-lg">
          <VideoDetails video={video} setVideo={setVideo} />
        </div>

        {/* Comments Section */}
        <div className="p-1 bg-gray-800 space-y-4 border-2 border-gray-500 w-full rounded-lg">
          <VideoComments videoId={video._id} />
        </div>
      </div>

      {/* Right Section */}
      <VideoSuggestions videoOwner={video.owner} />
    </div>
  );
}

// ---- components of single video page ----
function VideoDetails({ video, setVideo }) {
  // states in the parent component are passed as props to this component
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [videoOwner, setVideoOwner] = useState({});
  const [loading, setLoading] = useState(true);
  const [videoLikes, setVideoLikes] = useState(video.videoLikes);

  // add to playlist popup states
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const loadVideoOwnerProfile = async () => {
    // setLoading(true);
    try {
      if (video.owner) {
        const videoOwnerId = video.owner;
        const ownerResponse = await axios.get(
          `${import.meta.env.VITE_HOST}/api/user/c/${video.owner}`,
          { withCredentials: true }
        );
        // console.log(ownerResponse);

        const videoOwnerData =
          ownerResponse && ownerResponse.data.data
            ? ownerResponse.data.data
            : null;

        setVideoOwner(videoOwnerData);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleSubscription = async (channelId) => {
    if (!channelId) {
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/subscription/c/${channelId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        // set isSubscribed state
        setVideoOwner((prevOwner) => {
          return { ...prevOwner, isSubscribed: !prevOwner.isSubscribed };
        });
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const toggleVideoLike = async (videoId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/like/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        // state management for video likes count
        if (video.isLiked) {
          setVideoLikes((prevLikes) => prevLikes - 1);
        } else {
          setVideoLikes((prevLikes) => prevLikes + 1);
        }
        // set isLiked state
        setVideo((prevVideo) => {
          return { ...prevVideo, isLiked: !prevVideo.isLiked };
        });
      }
    } catch (error) {
      console.error("Error toggling video like:", error);
    }
  };

  const handleAddVideoToPlaylist = async ({ playlistId, videoId }) => {
    // const videoId = video._id;
    // console.log(videoId + " playlist : "+playlistId);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_HOST}/api/playlist/add/${videoId}/${playlistId}`,
        {},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        console.log("Video Added to Playlist Successfully !");
      }
    } catch (e) {
      // console.log(e.response.data);
      const data = showAlertFromErrorHtml(e.response.data);
      console.error("ERROR :: "+ data);
    } finally {
      setShowAddToPlaylist((prev) => !prev);
    }
  };

  useEffect(() => {
    loadVideoOwnerProfile();
    // console.log(videoOwner);
  }, [video]);

  return (
    !loading && (
      <div className="text-white w-full p-4">
        <h1 className="text-2xl font-bold">{video?.title}</h1>
        <p className="text-sm text-gray-400">
          {video?.views} Views · {calculateTimeDifference(video?.createdAt)}
        </p>

        {/* Channel Info */}
        <div className="flex items-center mt-4">
          <div className="flex items-center">
            <img
              src={videoOwner?.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full bg-gray-500 object-cover"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{videoOwner?.username}</h2>
              <p className="text-sm text-gray-400">
                {videoOwner?.subscribersCount} Subscribers
              </p>
            </div>
          </div>
          <div className="flex ml-auto float-end lg:pr-5 space-x-2">
            {/* // check */}
            <button
              // disabled={videoOwner._id === userData._id}   // check if the user is the owner of the video
              onClick={() => toggleSubscription(videoOwner._id)}
              className={`text-white px-4 py-2 rounded-xl border-2 
            ${
              videoOwner?.isSubscribed
                ? "bg-gray-600 border-gray-700 hover:bg-gray-700"
                : "bg-red-500 border-red-600 hover:bg-red-600"
            }
            ${
              videoOwner._id === userData._id
                ? "bg-gray-600 border-gray-700"
                : ""
            }
            `}
            >
              {videoOwner?.isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>

            <button
              onClick={() =>
                navigate(`/channel-profile/${videoOwner._id}/videos`)
              }
              className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-xl border-2 border-blue-800
           hover:bg-blue-700 transition-colors"
            >
              View Channel
            </button>
          </div>
        </div>

        {/* Video Actions */}
        <div className="flex mt-4 space-x-4">
          <button
            onClick={() => toggleVideoLike(video._id)}
            className={`text-white px-4 py-2 rounded-2xl border-2 bg-gray-600 border-gray-700 hover:bg-gray-700`}
          >
            {videoLikes} {video?.isLiked ? "👍🏻" : "👍"}
          </button>

          <button
            onClick={() => setShowAddToPlaylist((prev) => !prev)}
            className="bg-gray-600 border-2 border-gray-700 hover:bg-gray-700 text-white px-4 py-2 rounded-2xl"
          >
            Add to Playlist
          </button>
          {showAddToPlaylist && (
            <AddToPlaylistPopup
              videoId={video._id}
              onCancel={() => setShowAddToPlaylist((prev) => !prev)}
              onSubmit={handleAddVideoToPlaylist}
            />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 mt-4">
          {video?.description || "No description available."}
        </p>
      </div>
    )
  );
}
function AddToPlaylistPopup({ videoId, onCancel, onSubmit }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const channelId = useSelector((state) => state.user.userData._id);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/playlist/user/${channelId}/`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data.data);

      setPlaylists(response.data.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOnSave = () => {
    if (!selectedPlaylist) {
      return;
    }
    // const isVideoAlreadyInPlaylist = playlists
    //   .filter((playlist) => playlist._id === selectedPlaylist)[0]
    //   .videos.some((vid) => vid === videoId);
    // console.log(isVideoAlreadyInPlaylist);
    

    // if (isVideoAlreadyInPlaylist) {
    //   console.log("Video Already in Playlist !");
    //   alert("Video Already in Playlist !");
    //   setErrorMessage("Video Already in Playlist !");
    //   return;
    // }
    
    onSubmit({ playlistId: selectedPlaylist, videoId });
  };

  useEffect(() => {
    loadPlaylists();
  }, [channelId]);

  return (
    <div className="fixed -inset-full flex items-center justify-center bg-black bg-opacity-60 z-40">
      <div className="bg-gray-900 rounded-xl shadow-lg w-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-300 hover:text-red-500 text-xl"
        >
          ✕
        </button>
        {/* Content */}
        <h2 className="text-xl  mb-4 p-3 text-gray-300  font-black  border-b-2 border-gray-700">
          Add Video to PlayList
        </h2>

        {/* Main Content of Popup  */}
        {loading && playlists.length === 0 ? (
          <Loader />
        ) : errorMessage ? (
          <div className="font-black text-red-400 text-xl m-2 p-2 w-80">{errorMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300 border-collapse rounded-3xl ">
              <thead className="border-b border-gray-600">
                <tr className="rounded-3xl">
                  <th className=" py-3 px-4 bg-gray-800 text-left">Select</th>
                  <th className=" py-3 px-4 bg-gray-800 text-left">
                    Playlist Name
                  </th>
                  <th className="py-3 px-4 bg-gray-800 text-left">
                    Total Videos
                  </th>
                  <th className=" py-3 px-4 bg-gray-800 text-left">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <tr><td>a</td><td>b</td><td>c</td></tr> */}
                {playlists.map((playlist, row) => (
                  <tr
                    key={playlist._id}
                    className={`${
                      row % 2 !== 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 cursor-pointer `}
                    onClick={() => {
                      selectedPlaylist === playlist._id
                        ? setSelectedPlaylist(null)
                        : setSelectedPlaylist(playlist._id);
                    }}
                  >
                    <td className="py-3 px-4 flex items-center gap-2 ">
                      <input
                        type="checkbox"
                        checked={selectedPlaylist === playlist._id}
                        onChange={() => {
                          selectedPlaylist === playlist._id
                            ? setSelectedPlaylist(null)
                            : setSelectedPlaylist(playlist._id);
                        }}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 text-left max-w-72">
                      {playlist.name}
                    </td>
                    <td className=" py-3 px-4 text-center">
                      {playlist.videos.length}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {calculateTimeDifference(playlist.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-4 gap-3">
          {/* Save Button */}
          <button
            onClick={handleOnSave}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition
              ${
                selectedPlaylist
                  ? ""
                  : "opacity-50 cursor-not-allowed bg-gray-600"
              }
              active:scale-95 hover:scale-105`}
          >
            Add to Playlist
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition active:scale-95 hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoSuggestions({ videoOwner }) {
  // console.log(channelId);

  const channelId = videoOwner;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if more videos are available

  const loadSuggestedVideos = async () => {
    // setLoading(true);
    const response = axios
      .get(`${import.meta.env.VITE_HOST}/api/video/channel`, {
        params: { page, limit: 5, channelId },
        withCredentials: true,
      })
      .then((response) => {
        const newVideos = response.data.data; // Adjust this based on your API response structure
        if (newVideos.length === 0) {
          setHasMore(false); // No more videos available
        } else {
          setVideos((prevVideos) => {
            // Prevent duplicate videos
            const videoIds = new Set(prevVideos.map((video) => video._id));
            const uniqueNewVideos = newVideos.filter(
              (video) => !videoIds.has(video._id)
            );
            return [...prevVideos, ...uniqueNewVideos];
          });
        }
      })
      .catch((error) => {
        console.error("Error loading suggested videos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (channelId) loadSuggestedVideos();
  }, [page, channelId]);

  return (
    <div className="bg-gray-900 space-y-1 w-full md:w-1/3 overflow-y-auto p-1">
      {loading ? (
        <Loader />
      ) : (
        <>
          {videos.map((video) => (
            <VideoCardListView key={video._id} video={video} />
          ))}
          <button
            disabled={!hasMore}
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="bg-gray-800 text-white w-full py-2 rounded-lg hover:bg-gray-700"
          >
            {hasMore ? "Load More.." : "No more videos"}
          </button>
        </>
      )}
    </div>
  );
}

function VideoComments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");

  const loadComments = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/comments/${videoId}`,
        {
          // params: { page, limit: 10},
          withCredentials: true,
        }
      );
      // console.log(response);
      const commentsData = response.data.data;

      setComments((prevComments) => {
        // Prevent duplicate videos
        const commentIds = new Set(prevComments.map((comment) => comment._id));
        const uniqueComments = commentsData.filter(
          (comment) => !commentIds.has(comment._id)
        );
        return [...prevComments, ...uniqueComments];
      });

      comments.sort(
        (com1, com2) => new Date(com2.createdAt) - new Date(com1.createdAt)
      );
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };
  const postComment = async (content, videoId) => {
    // console.log("post clicked");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/comments/${videoId}`,
        { content },
        { withCredentials: true }
      );
      if (response.status === 200) {
        loadComments();
        // setComments(prevComments => [response.data.data , ...prevComments])
        // console.log(comments);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_HOST}/api/comments/c/${commentId}`,
        {
          withCredentials: true,
        }
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    // console.log("Delete Comment",commentId);
  };

  const handleEditComment = async (commentId, updatedContent) => {
    const comment = comments.find((comnt) => comnt._id === commentId);
    if (comment.content === updatedContent) {
      console.log("Edit / Update Content (Content is same)  !...");
      return;
    }
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_HOST}/api/comments/c/${commentId}`,
        { content: updatedContent },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            if (comment._id === commentId) {
              return { ...comment, content: updatedContent };
            }
            return comment;
          });
        });
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-gray-800 text-white min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">{comments.length} Comments</h1>
        {/* Add New Comment Scetion  */}
        <div className="flex items-center space-x-2">
          {/* Comment Data input  */}
          <input
            onChange={(e) => setCommentContent(e.target.value)}
            id="contentField"
            type="text"
            placeholder="Add a Comment"
            className="w-full mt-4 p-2 rounded-md bg-gray-900 text-white
           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Post Comment Button */}
          <button
            onClick={() => {
              postComment(commentContent, videoId);
              document.getElementById("contentField").value = "";
            }}
            className="w-24 bg-blue-600 text-white px-4 py-2 rounded-2xl mt-4 p-2 hover:bg-blue-700 active:scale-95"
          >
            {" "}
            Post{" "}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}
      </div>
      {/* <button
        disabled={!hasMore}
        onClick={() => setPage((prevPage) => prevPage + 1)}
        className="bg-gray-800 text-white w-full p-2 mt-4 rounded-lg hover:bg-gray-700"
      >
        {hasMore ? "Load More.." : "No more videos"} 
      </button> */}
    </div>
  );
}
