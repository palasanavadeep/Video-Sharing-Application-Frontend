import React, { useState } from "react";

const PopupModal = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control popup visibility
  const [content, setContent] = useState(""); // State to store input content

  const togglePopup = () => setIsOpen(!isOpen); // Toggle popup visibility
  const saveContent = () => {
    console.log("Saved Content:", content);
    togglePopup();
  };

  return (
    <div className="relative">
      {/* Button to open popup */}
      <button
        onClick={togglePopup}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Open Popup
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center  z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={togglePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Content */}
            <h2 className="text-xl font-semibold mb-4">Enter Content</h2>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      )}
    </div>
  );
};

export default PopupModal;
