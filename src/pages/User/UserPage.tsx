import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "contexts/UserContext";
import NavBar from "components/NavBar";
import axiosInstance from "utils/AxiosInstance";
import { UserInfo } from "types/types";
import styles from "./UserPage.module.css";
import FormatDate from "utils/DateUtils";
import { toast } from "react-toastify";
import shardStyles from "styles/shared.module.css";

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
        toast.error("Failed to fetch user information:" + err);
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
      toast.error("Failed to update user information:" + err);
      setUpdateStatus("Failed to update user information. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={shardStyles.homeContainer}>
      <NavBar />
      <div className={styles.userInfoBox}>
        {userLoading ? (
          <div>Loading user information...</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : !userData ? (
          <div>User information not found.</div>
        ) : (
          <div className={styles.userSettingInfo}>
            <div className={styles.infoRow}>
              <label htmlFor="username">user:</label>
              <span id="username">{userData.name}</span>
            </div>

            <div className={styles.infoRow}>
              <label>created:</label>
              <span>{FormatDate(new Date(userData.createdAt))}</span>
            </div>

            <div className={styles.infoRow}>
              <label>karma:</label>
              <span>{userData.karma}</span>
            </div>

            <div className={styles.infoRow}>
              <label htmlFor="about">about:</label>
              {isOwnProfile ? (
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              ) : (
                <p className={styles.aboutText}>
                  {userData.about || "No about information provided."}
                </p>
              )}
            </div>

            {isOwnProfile && (
              <div className={styles.infoRow}>
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
                className={`${styles.updateStatus} ${
                  updateStatus.includes("successfully") ? "success" : "error"
                }`}
              >
                {updateStatus}
              </div>
            )}

            {isOwnProfile && (
              <button
                className={styles.updateButton}
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
