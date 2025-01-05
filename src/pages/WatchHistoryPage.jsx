import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useInfiniteScroll from "../components/InfiniteLoading/useInfiniteScroll.js";
import ScrollableVideoGallery from "../components/gallery/ScrollableVideoGallery.jsx";

function LikedVideosPage() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 

  const loadMoreVideos = useCallback(async () => {
    
    if (!hasMore || loading) return; // Stop if no more videos are available or if already loading
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/api/user/watch-history`, {
        params: { page, limit: 10 },
        withCredentials: true,
      });
      const newVideos = response.data.data; 
      if (! newVideos || newVideos.length === 0) {
        setHasMore(false); // No more videos available
        return;
        
      } else {
        setVideos((prevVideos) => {
          // Prevent duplicate videos
          const videoIds = new Set(prevVideos.map(video => video._id));
          const uniqueNewVideos = newVideos.filter(video => !videoIds.has(video._id));
          return [...prevVideos, ...uniqueNewVideos];
        });
        setPage((prevPage) => prevPage + 1);
        
      }
    } catch (error) {
      console.log("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    if (hasMore && !loading) {
      loadMoreVideos();
    }
  }, [hasMore, loading]); 
  // useEffect(() => {
  //   loadMoreVideos();
  // }, []); // Only run once on component mount

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

export default LikedVideosPage;