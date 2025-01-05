import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import ChannelSubscriptionsCard from "../components/ChannelSubscriptionsCard";
function SubscriptionsPage() {

  const [subscribed, setSubscribed] = React.useState([]);
  const [totalSubscribed, setTotalSubscribed] = React.useState(0);
  const userData = useSelector((state) => state.user.userData);

  const loadSubscribtions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/api/subscription/c/${userData._id}/`,
        {
          withCredentials: true,
        }
      );
    
      setSubscribed(response.data.data);
      setTotalSubscribed(response.data.data.length);

    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadSubscribtions();
    
  },[totalSubscribed]);


  return (
    
    <div>
      {subscribed.map((item) => (
        <ChannelSubscriptionsCard
          key={item.channel._id}
          channelId={item.channel._id}
          avatar={item.channel.avatar}
          username={item.channel.username}
          fullName={item.channel.fullName}
        />
      ))}
    </div>
  );
}

export default SubscriptionsPage;
