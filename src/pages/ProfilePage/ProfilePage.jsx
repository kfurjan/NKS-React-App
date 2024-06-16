import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../redux/actions/userActions";
import "./ProfilePage.css";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user.name,
    username: user.email,
    password: user.password,
    file: null,
  });

  useEffect(() => {
    setProfileData({
      name: user.name,
      username: user.email,
      password: user.password,
      file: null,
    });
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (event) => {
    setProfileData({ ...profileData, file: event.target.files[0] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      updateUser(profileData, () => {
        navigate("/customers");
      })
    );
  };

  return (
    <div className="profile-container">
      <h1>Profile Screen</h1>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profileData.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={profileData.password}
          onChange={handleInputChange}
          required
        />

        <div className="avatar-upload">
          <label htmlFor="avatar" className="upload-button">
            Change avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className="preview">
            {profileData.file ? (
              <img
                src={URL.createObjectURL(profileData.file)}
                alt="Avatar preview"
                onLoad={() => URL.revokeObjectURL(profileData.file)}
              />
            ) : (
              user.image && (
                <img src={user.image} alt="Profile" className="profile-image" />
              )
            )}
          </div>
        </div>

        <button type="submit" className="update-btn">
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
