import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import VideoCard from "../components/VideoCard.jsx";
// import Loader from "../components/InfiniteLoading/Loader.jsx";
import useInfiniteScroll from "../components/InfiniteLoading/useInfiniteScroll.js";
import ScrollableVideoGallery from "../components/gallery/ScrollableVideoGallery.jsx";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Track if more videos are available

  const loadMoreVideos = useCallback(async () => {
    if (!hasMore || loading) return; // Stop if no more videos are available or if already loading

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/video/`,
        {
          params: { page, limit: 6 },
          withCredentials: true,
        }
      );

      const newVideos = response.data.data; // Adjust this based on your API response structure
      // console.log(" Home : "+newVideos);
      // console.log(newVideos);
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
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.log("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
    // console.log("page"+page+" "+"hasMore:"+hasMore+" "+"loading"+" "+loading);
  }, [page, hasMore, loading]);

  useEffect(() => {
    
    loadMoreVideos();
    setLoading(false);
  }, []); // Only run once on component mount

  const [lastElementRef] = useInfiniteScroll(loadMoreVideos);

  return (
    <ScrollableVideoGallery
      videos={videos}
      loading={loading}
      hasMore={hasMore}
      lastElementRef={lastElementRef}
    />
  );
}

export default HomePage;

// <div className="container mx-auto p-4">
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//     {videos.map((video, index) => (
//       <VideoCard
//         key={index}
//         title={video.title}
//         description={video.description}
//         videoUrl={video.videoUrl}
//         thumbnail={video.thumbnail}
//         duration={video.duration}
//       />
//     ))}
//     <div ref={lastElementRef} className="h-10"></div>
//   </div>
//   {loading && (
//     <div className="flex justify-center items-center mt-4">
//       <Loader />
//     </div>
//   )}
//   {!hasMore && (
//     <div className="text-center mt-4 text-gray-500">
//       No more videos available.
//     </div>
//   )}
// </div>
