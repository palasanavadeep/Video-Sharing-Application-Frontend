import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";
import Loader from "../../components/InfiniteLoading/Loader";
import LoadingProgress from "../../utilities/LoadingProgress";

function SignInPage() {
  const navigate = useNavigate();

  // const [data, setData] = React.useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Submitted");

    const userOrEmail = e.target.username.value.includes('@') ? 'email' : 'username';
    const  data = {
      [userOrEmail]: e.target.username.value,
      password: e.target.password.value,
    };
    // console.log(data);
    

    try {
      const response = await axios.post(`${import.meta.env.VITE_HOST}/api/user/login`, 
        data,{
        withCredentials: true,
      });
      // const response = await axios.post(`/api/user/login`,
      //   data,{
      //   withCredentials: true,
      // });
      
      dispatch(login(response.data.user));
      navigate('/home');
    } catch (error) {
      console.error('Error signing in:', error);
      window.alert('Error signing in. Please try again.');
    }
    finally{
      setLoading(false);
    }

  };
  return (
    loading ? <LoadingProgress message={"Loading..."}/> : (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Sign In
        </h2>
        <form  onSubmit={handleSubmit}>
          {/* Username or Email */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              //   required
              placeholder="Enter your username or email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              //   required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Forgot Password */}
          <div className="flex justify-center md:justify-end mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline dark:text-blue-400"
            >
              Forgot Password?
            </Link>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    )
  );
}

export default SignInPage;
