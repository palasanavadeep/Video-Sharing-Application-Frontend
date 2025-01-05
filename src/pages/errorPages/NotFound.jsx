import React from 'react'
import { Link } from 'react-router-dom';
function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-2xl text-gray-600">Page Not Found</p>
      <p className="mt-2 text-gray-500 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
    )
}

export default NotFound
