import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { updateUserData } from '../../redux/userSlice'

function PersonalInfoPage() {

    const { userData} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState(userData.fullName);
    // const [firstName, setFirstName] = useState(userData.fullName.substring(0,userData.fullName.trim().lastIndexOf(" ")))
    // const [lastName, setLastName] = useState(userData.fullName.substring(userData.fullName.trim().lastIndexOf(" ")+1))
    const [email, setEmail] = useState(userData.email);
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(fullName.trim().length || email.trim().length){
            setMessage("Please fill all the fields");
        }
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_HOST}/api/user/update-profile`,
                // { fullName : firstName+lastName.trim() , email },
                { fullName , email },
                { withCredentials: true }
            );
            console.log(response);
            if(response.data.success){
                dispatch(updateUserData(response.data.data));
                setMessage("Profile updated successfully!");
            }
        } catch (error) {
            console.log(error);
            setMessage("Failed to update profile. Check details and Try Again.");
        }finally{
            setFullName("");
            setEmail("");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Update Personal Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="FullName"
              className="block text-sm font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="FullName"
              value={fullName}
              placeholder="Update Full Name"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
            //   required
            />
          </div>
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Update Email here"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
            //   required
            />
          </div>
          {message && (
            <p
              className={`text-sm font-medium ${
                message.includes("successfully")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 rounded-lg text-gray-100 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Update 
          </button>
        </form>
      </div>
    </div>
    )
}

export default PersonalInfoPage
