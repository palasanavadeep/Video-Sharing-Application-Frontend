import React, { useEffect, useState } from 'react'
import SubscriberProfileComponent from '../../components/SubscriberProfileComponent'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function ChannelSubscribedPage() {

    const channelId  = useParams().channelId;
    const [subscribers,setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);


    const loadData = async () => {
        // console.log(channelId);
        
        const response = await axios.get(`${import.meta.env.VITE_HOST}/api/subscription/c/${channelId}`,
            {
                withCredentials : true
            }
        )

        if(!response.data.success){
            console.error("Error fetching channel profile:", response);
        }else{
            setSubscribers(response.data.data);
            // console.log(response.data.data);
            
        }
    }

    useEffect(() => {
        loadData();
        setLoading(false);
    },[]);


    return (
    <div className="w-full mx-auto space-y-2 m-2">
       {subscribers.map((subscriber) => (
        <SubscriberProfileComponent 
            key={subscriber._id}
            avatar={subscriber.channel.avatar}
            username={subscriber.channel.username}
            fullName={subscriber.channel.fullName}
            channelId={subscriber.channel._id}
            subscribedSince={subscriber.createdAt}
        />
       ))}
    </div>
    )
}

export default ChannelSubscribedPage
