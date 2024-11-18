import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = ({ userId }) => {
  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    avatar: null,
    role: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/${userId}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load profile data. Please try again.');
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setUserData({
        ...userData,
        avatar: files[0]
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('email', userData.email);
    formData.append('role', userData.role);
    formData.append('password', userData.password);
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/v1/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Profile updated:', response.data);
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Profile update failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {success && <p style={{ color: 'green' }}>Profile updated successfully!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Отображение аватара пользователя */}
      {userData.avatar && (
        <div>
          <img src={userData.avatar} alt="User Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={userData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="IN">Intern</option>
            <option value="FR">Frontend</option>
            <option value="BK">Backend</option>
            <option value="DO">Devops</option>
            <option value="PM">Project Manager</option>
            <option value="AN">Analyst</option>
            <option value="DS">Designer</option>
          </select>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <button className='button' type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;