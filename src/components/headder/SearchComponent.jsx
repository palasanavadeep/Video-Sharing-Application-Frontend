import React, { useState, useEffect } from "react";
import axios from "axios";
// import 'tailwindcss/tailwind.css';
import { FaSearch } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
// import LinearProgress from '@mui/material/LinearProgress';
import { IoVideocam } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

// const SearchComponent = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (query.length === 0) {
//         setResults([]);
//         return;
//       }
//       setLoading(true);
//       try {
//         const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
//         setResults(response.data.items);
//       } catch (error) {
//         console.error('Error fetching search results', error);
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(fetchData, 300);

//     return () => clearTimeout(debounceFetch);
//   }, [query]);

//   return (
//     <div className="flex p-4 max-w-md mx-auto my-auto justify-center items-center text-gray-900">
//       <div className="flex justify-center items-center relative">

//         <input
//           type="text"
//           placeholder="Search..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className=" bg-white w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//         {loading && (
//           <div className="absolute top-0 right-0 mt-2 mr-4">
//             <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
//             </svg>
//           </div>
//         )}
//       </div>
//       <div className="mt-4">
//         {results.length > 0 ? (
//           <ul className="text-white bg-gray-800 border rounded-lg shadow-md divide-y divide-gray-200">
//             {results.map((result, index) => (
//               <li key={index} className="p-4 hover:bg-gray-100">
//                 {result.name || result.full_name}
//               </li>
//             ))}
//           </ul>
//         ) : query.length > 0 && !loading ? (
//           <p className="text-center text-white">No results found</p>
//         ) : null}
//       </div>
//     </div>
//   );
// };

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // const handleSearch = async () => {
  //   if (query.length === 0) {
  //     setResults([]);
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `https://api.github.com/search/repositories?q=${query}`
  //     );
  //     setResults(response.data.items);
  //     console.log(response.data.items);
  //   } catch (error) {
  //     console.error("Error fetching search results", error);
  //     setResults([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSearch = async () => {
    if (query.length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // const response = await axios.get(
        // `https://api.github.com/search/repositories?q=${query}`
      // );
      // setResults(response.data.items);
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/user/search/${query}`
      );
      console.log(response.data.data);
      setResults(response.data.data);
    } catch (error) {
      console.error("Error fetching search results", error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => handleSearch(), 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <div className=" w-2/5">
      <div className="flex">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className=" bg-gray-800 w-full px-4 py-2 border border-blue-700 rounded-s-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* search button */}
        <button
          // disabled
          onClick={() => handleSearch(query)}
          className="cursor-pointer flex p-3 bg-blue-600 rounded-e-full items-center justify-center "
        >
          {loading ? (
            // loading spinner
            <div className="m-auto p-0">
              {/* from mui */}
              <CircularProgress size="20px" color="inherit" />
            </div>
          ) : (
            <FaSearch className="m-auto text-white  size-5" />
          )}
        </button>
      </div>

      <div className="mt-4 ">
        {results && results.users && results.videos ? (
          <ul className="text-white bg-gray-900 rounded-md border shadow-md max-h-80 overflow-y-auto">
            {results.users.map((user, index) => (
              <li key={index} className="p-4 hover:bg-gray-800 border-b border-gray-700 rounded-md">
                <UserResultCard user={user} />
              </li>
            ))}
            {results.videos.map((video, index) => (
              <li key={index} className="space-y-2 p-4 hover:bg-gray-800 border-b border-gray-700 rounded-md">
                <VideoResultCard video={video} />
              </li>
            ))}
          </ul>
        ) : query.length > 0 && !loading ? (
          <p className="bg-gray-800 text-center text-white rounded-md border">No results found</p>
        ) : null}
      </div>
    </div>
  );
};
export default  SearchComponent;

function UserResultCard({ user }) {
  return (
    <div className="flex items-center ">
      <FaUser className="text-gray-300 mr-5 size-5" />
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full"
      />
      <div className="ml-4">
        <h2 className="text-white text-lg font-semibold">{user.username}</h2>
        <p className="text-sm text-gray-500">{user.fullName}</p>
      </div>
    </div>
  );
}

function VideoResultCard({ video }) {
  return (
    <button className="flex items-center ">
      <IoVideocam className="text-gray-3S00 mr-5 size-6" />
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-12 h-12 rounded-md"
      />
      <div className="ml-4">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <p className="text-sm text-gray-500">{video.description}</p>
      </div>
    </button>
  );
}