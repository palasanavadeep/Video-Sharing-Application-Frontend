import React from 'react'
import Container from '../Container'
import Logo from './Logo'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserIcon from './UserIcon'
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/userSlice'
import SearchComponent from './SearchComponent'
function Headder() {

    const status = useSelector(state => state.user.isLoggedIn);
    const userData = useSelector(state => state.user.userData);
    const dispatch = useDispatch();
    // console.log(userData);
    
    return (
        <header className="fixed z-50 top-0 left-0 p-4 bg-gray-900 text-gray-100 w-full">
        <div className="container flex justify-between h-12 mx-auto">
          <Link
            to="/home"
            className="flex items-center p-2"
          >
            <Logo />
          </Link>

        {/* <div className='text-white hidden md:flex container justify-between h-12 max-w-md lg:max-w-xl'>
            <h2>Search Bar</h2>.
            
        </div> */}
        <SearchComponent />



          <div className="items-center flex space-x-4">
            {status ? <>
                <Link to={`channel-profile/${userData._id}/videos`}
                className="items-center p-2 hidden md:block hover:scale-105 active:scale-95">
                   <UserIcon avatar={userData.avatar}/>
                </Link>
                <Link to="/signout"
                className=' h-12 w-12 rounded-full flex items-center shadow-md shadow-gray-600 bg-red-500 hover:scale-105 active:scale-95'>
                  <abbr
                  title="Signout" 
                  className='m-auto'
                  onClick={()=> {
                    dispatch(logout())
                  }}>
                    <FiLogOut className='size-6 text-gray-100 '/>
                  </abbr>
                </Link>

            </>
            : <>
                <Link to="/signin"
                className="self-center px-8 py-3 rounded">
                    Sign in
                </Link>
                <Link to="/signup"
                className="self-center px-8 py-3 font-semibold rounded bg-blue-600 text-white">
                  Sign up
                </Link>
                </>}
          </div>
  
          {/* <button className="p-4 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-coolGray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
   */}
  
        </div>
      </header>
    )
}

export default Headder
