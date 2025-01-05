import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../../components/InfiniteLoading/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditPopup } from "../../components/CommentCard";
import DeleteAlert from "../../utilities/DeleteAlert";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.user.userData);
  const [isUploadVideoPopupOpen, setIsUploadVideoPopupOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false); // Loading while Uploading Video

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/dashboard/stats`,
        {
          withCredentials: true,
        }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/dashboard/videos`,
        {
          withCredentials: true,
        }
      );
      setVideos(response.data.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };
  const uploadVideo = async (formData) => {
    setLoadingProgress((prev) => !prev);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/video/`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        // console.log("Video Uploaded Successfully");
        setVideos((prevVideos) => [response.data.data, ...prevVideos]);
        // fetchVideos();
      } else {
        console.error("Error while uploading video - :", response);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoadingProgress((prev) => !prev);
      setIsUploadVideoPopupOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchVideos();
    setLoading(false);
  }, []);

  // console.log(videos);
  // console.log(stats);

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-gray-950 text-white min-h-screen p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Welcome Back, {userData.username}
        </h1>
        <p className="text-gray-400">
          Seamless Video Management, Elevated Results.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-purple-400 text-4xl font-bold">
            {stats.totalViews}
          </div>
          <p className="text-gray-300">Total views</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-purple-400 text-4xl font-bold">
            {stats.totalSubscribers}
          </div>
          <p className="text-gray-300">Total subscribers</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <div className="text-purple-400 text-4xl font-bold">
            {stats.totalLikes}
          </div>
          <p className="text-gray-300">Total likes</p>
        </div>
      </div>

      {/* Video Table */}
      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Videos</h2>

          <button
            onClick={() => setIsUploadVideoPopupOpen((prev) => !prev)}
            className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700"
          >
            + Upload video
          </button>
          {isUploadVideoPopupOpen && (
            <UploadVideoPopup
              onCancel={() => setIsUploadVideoPopupOpen((prev) => !prev)}
              onSubmit={uploadVideo}
            />
          )}
          {/* Loading while Uploading Video  */}
          {loadingProgress && (
            <div className="fixed -inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {" "}
            <div className="bg-gray-800 text-white w-auto min-w-32 h-32 p-6 rounded-lg shadow-lg mx-4 justify-center items-center font-semibold ">
              <div>{"Uploading video..."}</div>
              <Loader />
            </div>
          </div>
          )}
        </div>

        <table className="w-full text-left text-gray-300 border-collapse rounded-3xl">
          {/* Thable headdings  */}
          <thead className="border-b border-gray-600 ">
            <tr className="bg-gray-800 ">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Date uploaded</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <VideoRow
                key={video._id}
                video={video}
                row={index}
                setVideos={setVideos}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UploadVideoPopup({ onSubmit, onCancel }) {
  const handleUploadVideoFormSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Submitted ");
    // setUploadingStatus((prev) => !prev);
    const formData = new FormData(e.target);
    onSubmit(formData);
    // setUploadingStatus(false);
  };

  return (
    <div className="fixed -inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
      <div className="bg-gray-800 text-white w-full max-w-4xl p-6 rounded-lg shadow-lg mx-4">
        {/* Title Bar */}
        <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-6">
          <h2 className="text-2xl font-semibold">Video Uploading Form</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white "
          >
            ✖
          </button>
        </div>

        {/* Form Layout */}
        <form
          onSubmit={handleUploadVideoFormSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          encType="multipart/form-data"
        >
          {/* Left Section */}
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Publish Status */}
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="publishStatus"
                name="publishStatus"
                // checked={true}
                // onChange={(e) => console.log(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2 rounded"
              />
              <label
                htmlFor="publishStatus"
                className="ml-2 text-sm font-medium"
              >
                Publish Status
              </label>
            </div> */}
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            {/* Video File Input */}
            <div>
              <label
                htmlFor="videoFile"
                className="block text-sm font-medium mb-2"
              >
                Video File
              </label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                accept="video/*"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Thumbnail Input */}
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium mb-2"
              >
                Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Upload
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VideoRow({ video, row, setVideos }) {
  const [published, setPublished] = useState(video.published);
  const [isEditVideoPopupOpen, setIsEditVideoPopupOpen] = useState(false);
  const [isDeleteVideoPopupOpen, setIsDeleteVideoPopupOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  // const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleTogglePublish = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_HOST}/api/video/toggle/publish/${video._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPublished((prev) => !prev);
      } else {
        window.alert("Toggling publish status Failed");
        console.error(
          "Error :: toggling publish status Unsuccessful :",
          response
        );
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
  }
  const editVideo = async (formData , videoId) => {
    // console.log("Form Data", Object.fromEntries(formData));
    
    
    setLoadingProgress((prev) => !prev);
    try{
      const response = await axios.patch(`${import.meta.env.VITE_HOST}/api/video/${videoId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      if(response.status === 200){
        const { title, description, thumbnail } = response.data.data;
        setVideos((prevVideos)=> (
          prevVideos.map((video) => (
            video._id === videoId ? 
            {...video , title , description , thumbnail} 
            : video
          ))
        ))
      }
    }catch(e){
      console.log(e);
    }finally{
      setLoadingProgress((prev) => !prev);
      setIsEditVideoPopupOpen((prev) => !prev);
    }

    
  };
  const deleteVideo = async (videoId) => {
    if (!videoId) {
      return;
    }
    setLoadingProgress((prev) => !prev);
    // setMessage("Deleting Video...");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_HOST}/api/video/${videoId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        // console.log("Video Deleted Successfully");
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video._id !== videoId)
        );
      } else {
        console.error("Error while deleting video - :", response);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      // setMessage("");
      setLoadingProgress((prev) => !prev);
      setIsDeleteVideoPopupOpen((prev) => !prev);
    }
  };

  return (
    <tr
      key={row}
      className={`${
        row % 2 !== 0 ? "bg-gray-800" : "bg-gray-700"
      } hover:bg-gray-600`}
    >
      <td className="py-3 px-4 flex items-center gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={published}
            onChange={handleTogglePublish}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-500 peer-checked:bg-purple-600"></div>
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full peer-checked:bg-white dark:peer-checked:bg-gray-300"></span>
        </label>
      </td>
      <td
        className="py-3 px-4 hover:text-purple-400 cursor-pointer"
        onClick={() => navigate(`/watch/${video._id}`)}
      >
        {video.title}
      </td>
      <td className="py-3 px-4">
        {video.likes} Likes / {video.comments} Comments
      </td>
      <td className="py-3 px-4">{formatDate(video.createdAt)}</td>
      <td className="py-3 px-4 flex gap-6">
        <button
          onClick={() => setIsEditVideoPopupOpen((prev) => !prev)}
          className="text-purple-400 hover:text-purple-600"
        >
          <FaEdit />
        </button>
        {isEditVideoPopupOpen && (
          <VideoEditPopup
            video={video}
            onSubmit={editVideo}
            onCancel={() => setIsEditVideoPopupOpen((prev) => !prev)}
          />
        )}
        <button
          onClick={() => setIsDeleteVideoPopupOpen((prev) => !prev)}
          className="text-red-400 hover:text-red-600"
        >
          <FaTrash />
        </button>
        {isDeleteVideoPopupOpen && (
          <DeleteAlert
            message={`Are you sure to delete Video :   ${video.title}  ?`}
            onCancel={() => setIsDeleteVideoPopupOpen((prev) => !prev)}
            onConfirm={() => deleteVideo(video._id)}
          />
        )}
        {/* Loading  */}
        {loadingProgress && (
          <div className="fixed -inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {" "}
            <div className="bg-gray-800 text-white w-auto min-w-32 h-32 p-6 rounded-lg shadow-lg mx-4 justify-center items-center font-semibold ">
              <div>{"Loading..."}</div>
              <Loader />
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
function VideoEditPopup({ video, onSubmit, onCancel }) {
  const [updatedVideo, setUpdatedVideo] = useState(video);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVideo((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditVideoFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData , video._id);
  };

  return (
    <div className="fixed -inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
      <div className="bg-gray-800 text-white w-full max-w-4xl p-6 rounded-lg shadow-lg mx-4">
        {/* Title Bar */}
        <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-6">
          <h2 className="text-2xl font-semibold overflow-hidden">
            Update / Edit Video : {video.title}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white "
          >
            ✖
          </button>
        </div>

        {/* Form Layout */}
        <form
          onSubmit={handleEditVideoFormSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          encType="multipart/form-data"
        >
          {/* Left Section */}
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={updatedVideo.title}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={updatedVideo.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            {/* Thumbnail Input */}
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium mb-2"
              >
                Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// function VideoDeletePopup({ video, setIsDeleteVideoPopupOpen }) {
//   return (
//     <div className="fixed -inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center  z-50">
//       <div className="bg-gray-900 rounded-lg shadow-lg w-96 max-w-4xl p-6 relative border-2 border-gray-700">
//         {/* Close Button */}
//         <button
//           onClick={() => set((prev) => !prev)}
//           className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
//         >
//           ✕
//         </button>

//         {/* Content */}
//         <h2 className="text-xl font-semibold mb-4 text-gray-300">
//           Update Comment
//         </h2>
//         <input
//           type="text"
//           // value={editContent}
//           // onChange={(e) => setEditContent(e.target.value)}
//           placeholder="Comment here..."
//           className="w-full px-4 py-2 bg-gray-700  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <div className="flex justify-end mt-4">
//           {/* Save Button */}
//           <button
//             // onClick={saveContent}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LoadingProgress(message = "Uplaoading Video...") {
//   return (
//     <div className="fixed -inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       {" "}
//       <div className="bg-gray-800 text-white w-auto min-w-32 h-32 p-6 rounded-lg shadow-lg mx-4 justify-center items-center font-semibold ">
//         <div>{message}</div>
//         <Loader />
//       </div>
//     </div>
//   );
// }
