import React from "react";

function Gallery({ children }) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {children}
      </div>
    </div>
  );
}

export default Gallery;
