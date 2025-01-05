import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector ,useDispatch} from "react-redux";
import { logout } from "../redux/userSlice";

function SideBar() {
  const status = useSelector((state) => state.user.isLoggedIn);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const isActive = ({ isActive }) =>
    `flex-1 py-3  ${
      isActive
        ? " text-blue-600 font-semibold rounded-sm "
        : "text-gray-200"
    }`;

  const items = [
    "Home",
    "Liked Videos",
    "Subscriptions",
    "Watch History",
    "Playlists",
    "Channel",
    "Dashboard",
    "Subscribers",
  ];
  return (
    <div>
      <div className=" bg-gray-700 h-screen flex flex-col border-r-4 border-gray-900">

        {/* Home  */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/home`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Home</div>
          </NavLink>
        </div>

        {/* Liked Videos */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/liked-videos`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold "> Liked Videos </div>
          </NavLink>
        </div>

        {/* My Content */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/channel-profile/${userData?._id}/videos`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">My Content</div>
          </NavLink>
        </div>

        {/* Subscriptions */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/subscriptions`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Subscriptions</div>
          </NavLink>
        </div>

        {/* Watch History */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/watch-history`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Watch History</div>
          </NavLink>
        </div>

        {/* Playlists */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/playlists`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Playlists</div>
          </NavLink>
        </div>

        {/* Channel */}
        {/* <div className="py-4 border-b-2">
          <NavLink
            to={`/channel-profile`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Channel</div>
          </NavLink>
        </div> */}

        {/* Dashboard */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/dashboard`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Dashboard</div>
          </NavLink>
        </div>

        {/* Subscribers */}
        <div className="py-4 border-b-2">
          <NavLink
            to={`/subscribers`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Subscribers</div>
          </NavLink>
        </div>

        {/* channel settings  */}
        
        <div className="py-4 border-b-2">
          <NavLink
            to={`/channel-settings/personal-info`}
            end
            className={isActive}
          >
            <div className=" text-left px-4 font-bold ">Settings</div>
          </NavLink>
        </div>
        
        

        {/* <> <div className='py-5'>
                    <Link to="/home">
                    <div className='text-white text-center font-bold'>Home</div>
                    </Link>
                </div>
                <div className='py-5'>
                    <div className='text-white text-center font-bold'>Liked Videos</div>
                </div>
                <div className='py-5'>
                    <div className='text-white text-center font-bold'>My Content</div>
                </div>
                <div className='py-5'>
                    <div className='text-white text-center font-bold'>Subscriptions</div>
                </div>
                <div className='py-5'>
                    <div className='text-white text-center font-bold'>Watch History</div>
                </div>
                <div className='py-5'>
                    <div className='text-white text-center font-bold'>Playlists</div>
                </div>
                <div>
                    <div className='text-white text-center font-bold'>Subscribers</div>
                </div> 
                </> */}
      </div>
    </div>
  );
}

export default SideBar;
