import React from 'react'
import { Link } from 'react-router-dom';
function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-red-600">401</h1>
      <p className="mt-4 text-2xl text-gray-600">Unauthorized Access</p>
      <p className="mt-2 text-gray-500">
        You do not have permission to access this page.
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

export default UnauthorizedPage
