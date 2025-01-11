import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { showAlertFromErrorHtml } from "../../utilities/formatApiError.js"
import LoadingProgress from "../../utilities/LoadingProgress";

function SignUpPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async(e) => {

    e.preventDefault();
    setLoading(true);
    const formdata = new FormData(e.target);
    // check if username already exist
    try{
        const usernameResponse = await axios.get(
            `${import.meta.env.VITE_HOST}/api/user/check-username/${formData.username}`, {
            }
        );
        
        if(!usernameResponse.data.data){
            window.alert('Username already exists. Please try another username.');
            return;
        }
        const response = await axios.post(
            `${import.meta.env.VITE_HOST}/api/user/register`,
            formdata,
            {
                withCredentials: true,
            }
        );
        if(response.data.success){
            // window.alert('User registered successfully. Please login to continue.');
            navigate('/signin');
        }else{
            const errorMessage = showAlertFromErrorHtml(response.data.data);
            // console.error('Error signing up:', response);
            return;
        }
    }catch(error){
        
        console.error('Error signing up:', error);
        // window.alert('Error signing up. Please try again.');
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
        {loading ? <LoadingProgress message={"Loading..."}/> : (
             <form
             onSubmit={handleSubmit}
             className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-6"
           >
             <div className="space-y-4">
               <div>
                 <label className="block text-white">Full Name</label>
                 <input
                   type="text"
                   name="fullName"
                   value={formData.fullName}
                   onChange={handleChange}
                   required
                   className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                 />
               </div>
               <div>
                 <label className="block text-white">Username</label>
                 <input
                   type="text"
                   name="username"
                   value={formData.username}
                   onChange={handleChange}
                   required
                   className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                 />
               </div>
               <div>
                 <label className="block text-white">Email</label>
                 <input
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   required
                   className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                 />
               </div>
               <div>
                 <label className="block text-white">Password</label>
                 <input
                   type="password"
                   name="password"
                   value={formData.password}
                   onChange={handleChange}
                   required
                   className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                 />
               </div>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-white">Avatar</label>
                 <input
                   type="file"
                   name="avatar"
                   onChange={handleFileChange}
                   className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                 />
               </div>
               <div>
                 <label className="block text-white">Cover Image</label>
                 <input
                   type="file"
                   name="coverImage"
                   onChange={handleFileChange}
                   className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                 />
               </div>
             </div>
             <div className="col-span-1 sm:col-span-2 flex flex-col items-center">
               <button
                 type="submit"
                 className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 Sign Up
               </button>
               <p className="mt-4 text-white">
                 Already a User ?
                 <Link to="/signin" className="text-blue-400 hover:underline">
                   Sign In
                 </Link>
               </p>
             </div>
           </form>
        )}
     
    </div>
  );
}

export default SignUpPage;
