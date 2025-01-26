import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import NavBar from './components/NavBar';
import axiosInstance from "./AxiosInstance";
import { UserInfo } from "./types";
import "./UserPage.css";
import { FormatDate } from "./utils/dateUtils";
import { toast } from "react-toastify";

const User: React.FC = () => {
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get("name");
  const { username, loading: userLoading } = useContext(UserContext);

  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for editable fields
  const [about, setAbout] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // States for update feedback
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  // Determine if the viewed profile is the current user's profile
  const isOwnProfile = nameParam === username;

  useEffect(() => {
    if (userLoading) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      setUpdateStatus(null); // Reset update status on new fetch

      try {
        let response;
        console.log("nameParam", nameParam);
        console.log("username", username);

        if (isOwnProfile) {
          // If the name parameter is the same as the current username, call /api/v1/users/me
          response = await axiosInstance.get("/api/v1/users/me", {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        } else {
          // Otherwise, call /api/v1/users?name={name}
          response = await axiosInstance.get("/api/v1/users", {
            params: { name: nameParam },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
        }

        // Assume the backend returns data in response.data
        setUserData(response.data);
        setAbout(response.data.about || "");
        setEmail(response.data.email || "");
      } catch (err: any) {
        toast.error("Failed to fetch user information:" +  err);
        setError("Unable to fetch user information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (nameParam) {
      fetchUserData();
    } else {
      setError("Username parameter not provided.");
      setLoading(false);
    }
  }, [nameParam, username, userLoading, isOwnProfile]);

  const updateUser = async () => {
    if (!userData) return;

    setUpdating(true);
    setUpdateStatus(null);

    try {
      const payload = {
        about,
        email,
      };

      const response = await axiosInstance.put("/api/v1/users", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Update local state with the response data
      setUserData(response.data);
      setUpdateStatus("User information updated successfully.");
    } catch (err: any) {
      toast.error("Failed to update user information:" +  err);
      setUpdateStatus("Failed to update user information. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="user-container">
      <NavBar />
      <div className="user-info-box">
        {userLoading ? (
          <div>Loading user information...</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : !userData ? (
          <div>User information not found.</div>
        ) : (
          <div className="user-setting-info">
            <div className="info-row">
              <label htmlFor="username">user:</label>
              <span id="username">{userData.name}</span>
            </div>

            <div className="info-row">
              <label>created:</label>
              <span>{FormatDate(new Date(userData.createdAt))}</span>
            </div>

            <div className="info-row">
              <label>karma:</label>
              <span>{userData.karma}</span>
            </div>

            <div className="info-row">
              <label htmlFor="about">about:</label>
              {isOwnProfile ? (
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              ) : (
                <p className="about-text">
                  {userData.about || "No about information provided."}
                </p>
              )}
            </div>

            {isOwnProfile && (
              <div className="info-row">
                <label htmlFor="email">email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            {isOwnProfile && updateStatus && (
              <div
                className={`update-status ${
                  updateStatus.includes("successfully") ? "success" : "error"
                }`}
              >
                {updateStatus}
              </div>
            )}

            {isOwnProfile && (
              <button
                className="update-button"
                onClick={updateUser}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
