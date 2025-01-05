import React from "react";
import { calculateTimeDifference } from "../utilities/calculateTimeDifference";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { useState } from "react";

function CommentCard({ comment , onDelete ,onEdit }) {
    
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

    return (
      <div className="flex items-start space-x-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        {/* Avatar */}
        <img
          src={comment.createdBy.avatar}
          alt={"avatar"}
          className="w-10 h-10 rounded-full"
        />
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            {/* Comment Owner  */}
            <div>
              <h2 className="font-semibold text-white">{comment.createdBy.fullName}</h2>
              <span className="text-gray-400 text-sm">{comment.createdBy.username}</span>
            </div>

            {/* Delete Button  and Controls */}
            <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">{calculateTimeDifference(comment.createdAt)}</span>
            {comment.isMyComment && (<>
            {/* Edit Button */}
              <MdModeEdit 
              onClick={()=> setIsPopupOpen((prev) => !prev)}
                className="bg-gray-700 rounded-full p-1 h-7 w-7 hover:scale-110 active:bg-gray-800"/>
                <EditPopup 
                isPopupOpen={isPopupOpen}
                setIsPopupOpen={setIsPopupOpen}
                editContent={editContent}
                setEditContent={setEditContent}
                saveContent={()=> {
                  onEdit(comment._id, editContent);
                  setIsPopupOpen(false);
                }}
                />
            {/* Delete Button */}
              <MdDelete 
              onClick={()=> onDelete(comment._id)}
              className="bg-red-400 rounded-full p-1 h-7 w-7 hover:scale-110 active:bg-red-600"/>
            </>)}
            </div>



          </div>
          <p className="mt-2 text-gray-300">{comment.content}</p>
        </div>
      </div>
    );
  };
  
export default CommentCard;
  
function EditPopup({isPopupOpen, setIsPopupOpen, editContent, setEditContent, saveContent}) {
  return(
    isPopupOpen && (
      <div className="fixed -inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center  z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg w-96 max-w-4xl p-6 relative border-2 border-gray-700">
          {/* Close Button */}
          <button
            onClick={() => setIsPopupOpen((prev) => !prev)}
            className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
          >
           ✕
          </button>

          {/* Content */}
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Update Comment</h2>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Comment here..."
            className="w-full px-4 py-2 bg-gray-700  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end mt-4">
            {/* Save Button */}
            <button
              onClick={saveContent}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export {EditPopup};