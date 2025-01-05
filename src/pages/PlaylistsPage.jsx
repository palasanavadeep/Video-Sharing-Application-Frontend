import React, { useEffect,useState } from "react";
import PlayListComponent from "../components/PlayListComponent";
import Container from "../components/Container";
import Gallery from "../components/gallery/Gallery";
import { useSelector } from "react-redux";
import axios from "axios";
import PlayListGallery from "../components/gallery/PlayListGallery";

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [totalPlaylists, setTotalPlaylists] = useState(0);
  const [isPlaylistCreatePopupOpen, setIsPlaylistCreatePopupOpen] = useState(false);
  const userData = useSelector((state) => state.user.userData);

  const loadPlaylists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/playlist/user/${userData._id}/`,
        {
          withCredentials: true,
        }
      );

      setPlaylists(response.data.data);
      setTotalPlaylists(response.data.data.length);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreatePlayList = async ({name , description}) => {
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/playlist/`,
        {
          name,
          description,
        },
        {
          withCredentials: true,
        }
      );
      if(response.data.success){
        setPlaylists((prevPlaylists) => [response.data.data , ...prevPlaylists]);
      }
    }catch(e){
      console.log(e);
    }finally{
      setIsPlaylistCreatePopupOpen((prev)=> !prev);
    }
    // setIsPlaylistCreatePopupOpen(false);
  }

  useEffect(() => {
    if(userData._id){
      loadPlaylists();
    }
    // console.log("Playlists Loaded" , playlists);
    // console.log(playlists);
    
  },[]);

  return (
    // <Container >
    //   {/* <Gallery>
    //     {playlists.map((playlist) => (
    //       <PlayListComponent
    //         key={playlist._id}
    //         playlistId={playlist._id}
    //         name={playlist.name}
    //         description={playlist.description}
    //         totalVideos={playlist.videos.length}
    //         owner={playlist.playListOwner}
    //         videos={playlist.videos}
    //         updatedAt = {playlist.updatedAt}
    //       />
    //     ))}
    //   </Gallery> */}
    //   <PlayListGallery playlists={playlists} />
    // </Container>
    <div >
      <div className="h-16 bg-gray-900 rounded-md rounded-b-3xl border-b-4 border-2
       border-gray-700 flex items-center justify-between px-4 ">
        <button
        className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 active:scale-95 transform transition-transform duration-300" 
        onClick={()=> setIsPlaylistCreatePopupOpen((prev)=> !prev)}
        >
          Create PlayList
        </button>
        {isPlaylistCreatePopupOpen && (
          <CreatePlayListPopup  
          onCancel={()=> setIsPlaylistCreatePopupOpen((prev)=> !prev)}
          onCreate={handleCreatePlayList}
        />
        )}
      </div>
      <PlayListGallery playlists={playlists} />
    </div>
  );
}

export default PlaylistsPage;

function CreatePlayListPopup({onCancel, onCreate}) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
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
      <h2 className="text-xl font-bold text-gray-300 mb-4">Create Playlist</h2>
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
          className="text-gray-300 mt-1 block w-full px-3 py-2 border rounded-md shadow-sm  bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          className="text-gray-300 mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter playlist description"
          rows="4"
        ></textarea>
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-600 rounded text-gray-300 hover:bg-gray-700 active:scale-95"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:scale-95"
          onClick={()=> onCreate({name, description})}
        >
          Create
        </button>
      </div>
    </div>
  </div>
  );
}
