import React from "react";
import { Outlet } from "react-router-dom";

function Container({ children }) {
  return <div className="w-full h-screen flex flex-col">{children}</div>;
}

function ScrollableContainer() {
  return (
    <div className="bg-gray-950 shadow-lg w-full p-2 overflow-auto flex-1">
      <Outlet />
    </div>
  );
}

export default Container;

export { ScrollableContainer };
