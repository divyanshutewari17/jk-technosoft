import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3005/posts',
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-title">Create Post</h1>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="create-post-button">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;