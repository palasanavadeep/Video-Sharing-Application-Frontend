import React, { useState } from "react";
import axios from "axios";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/api/user/change-password`,
        { oldPassword: currentPassword, newPassword },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        setMessage("Password updated successfully!");
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to update password. Check Password and Try Again.");
      return;
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium mb-1"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              placeholder="Enter Your Current Password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              placeholder="Enter New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {message && (
            <p
              className={`text-sm font-medium ${
                message.includes("successfully")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 rounded-lg text-gray-100 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
