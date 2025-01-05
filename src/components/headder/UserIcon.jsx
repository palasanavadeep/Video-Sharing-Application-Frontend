import React from 'react'

function UserIcon({avatar}) {
    // console.log(avatar);
    
    return (
        <div className='w-12 h-12 rounded-full overflow-hidden shadow-gray-600 shadow-md'>
            <img src={avatar} alt="User Avatar" className='object-cover' />
        </div>
    )
}

export default UserIcon
