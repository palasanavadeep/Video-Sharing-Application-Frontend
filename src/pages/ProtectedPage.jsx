import React from 'react'
import Loader from '../components/InfiniteLoading/Loader'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect , useState } from 'react'


function ProtectedPage({children , authentication = true}) {

    const navigate = useNavigate();
    const authStatus = useSelector(state => state.user.isLoggedIn);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!authStatus && authentication){
            navigate('/signin');
        }
        else if (authStatus && !authentication){
            navigate('/home');
        }
        setLoading(false);
    }, [authentication , authStatus , navigate])


    return (
        loading ? <Loader /> : <>{children}</>
    )
}

export default ProtectedPage
