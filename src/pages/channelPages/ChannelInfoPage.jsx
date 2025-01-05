import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../redux/userSlice";
import Loader from "../../components/InfiniteLoading/Loader";

const ChannelInfoPage = () => {
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
  const [username, setUsername] = useState(userData.username);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState(false);

  const updateField = async (field, value) => {
    try {
      setStatus(prev => !prev);
      let response;

      if (field === "avatar" || field === "coverImage") {
        const formData = new FormData();
        formData.append(field, value);

        response = await axios.patch(
          `${import.meta.env.VITE_HOST}/api/user/update-${field}`,
          formData,
          {
            withCredentials: true,
          }
        );
      }
      else if (field === "username") {
        response = await axios.patch(
            `${import.meta.env.VITE_HOST}/api/user/update-profile`,
            { username : value },
            { withCredentials: true }
        );
      }

    //   setStatus(`${field} updated successfully!`);
    //   console.log(`${field} response:`, response.data.data);
      if(response.data.success){
        dispatch(updateUserData(response.data.data));
        // console.log(`${field} updated successfully!`);
      }
    } catch (error) {
      console.error(`${field} error:`, error.response || error.message);
    }finally{
        setStatus(prev => !prev);
    }
  };

  const handleUsernameUpdate = (e) => {
    e.preventDefault();
    updateField("username", username);
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    if (avatar) await updateField("avatar", avatar);
  };

  const handleCoverImageUpdate = async (e) => {
    e.preventDefault();
    if (coverImage) await updateField("coverImage", coverImage);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Update Profile</h2>

        {/* Update Username */}
        <form onSubmit={handleUsernameUpdate} className="space-y-4 mb-6">
          
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Update Username
            </label>
           <div className="flex space-x-2 justify-between h-10">
           <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
              required
              disabled
            />
          
          <button
            type="submit"
            disabled
            className="w-72 py-2 px-4 bg-gray-600 rounded-lg text-gray-100 font-semibold"
          >
            Update Username
          </button>
           </div>
        </form>

        {/* Update Avatar */}
        <form onSubmit={handleAvatarUpdate} className="space-y-4 mb-6">
         
            <label htmlFor="avatar" className="block text-sm font-medium mb-1">
              Update Avatar
            </label>
            <div className="flex space-x-2 justify-between">
            <input
              type="file"
              id="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full text-gray-300 bg-gray-600 rounded-md p-2"
              accept="image/*"
              required
            />
          
          <button
            type="submit"
            className="w-72 py-2 px-4 bg-blue-600 rounded-lg text-gray-100 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Update Avatar
          </button>
          </div>
        </form>

        {/* Update Cover Image */}
        <form onSubmit={handleCoverImageUpdate} className="space-y-4">
          
            <label htmlFor="coverImage" className="block text-sm font-medium mb-1">
              Update Cover Image
            </label>
            <div className="flex space-x-2 justify-between ">
            <input
              type="file"
              id="coverImage"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full text-gray-300 bg-gray-600 rounded-md p-2"
              accept="image/*"
              required
            />
          
          <button
            type="submit"
            className="w-72 py-2 px-4 bg-blue-600 rounded-lg text-gray-100 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Update Cover Image
          </button>
          </div>
        </form>

        {/* Status Message */}
        {status && 
            <div className="fixed -inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {" "}
            <div className="bg-gray-800 text-white w-auto min-w-32 h-32 p-6 rounded-lg shadow-lg mx-4 justify-center items-center font-semibold ">
              <div>{"Uploading..."}</div>
              <Loader />
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ChannelInfoPage;
