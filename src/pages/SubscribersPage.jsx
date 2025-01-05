import React from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import SubscriberCard from '../components/SubscriberCard.jsx';
import { useEffect } from 'react';

function SubscribersPage() {

    const [subscribers, setSubscribers] = React.useState([]);
    const [totalSubscribers, setTotalSubscribers] = React.useState(0);
    const userData = useSelector(state => state.user.userData);

    const loadSubscribers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_HOST}/api/subscription/u/${userData?._id}/`, {
                withCredentials: true,
            });
            setSubscribers(response.data.data);
            // console.log(subscribers);
            setTotalSubscribers(response.data.data.length);
            // console.log("Total Subscribers : "+totalSubscribers);
            
        } catch (error) {
            console.error("Error fetching subscribers:", error);
        }
    }

    useEffect(() => {
        loadSubscribers();
        // console.log("Subscribers : "+subscribers);
        
    }, [totalSubscribers]);



    return (
        <div className='text-white'>
            {subscribers.map((subscriber) => (
                <SubscriberCard
                    key={subscriber._id}
                    channelId={subscriber.subscribers._id}
                    avatar={subscriber.subscribers.avatar}
                    username={subscriber.subscribers.username}
                    fullName={subscriber.subscribers.fullName}
                    createdAt={subscriber.createdAt}
                />
            ))}
        </div>
    )
}

export default SubscribersPage
