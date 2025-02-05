import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse, provider) => {
    try {
      const { data } = await axios.post('http://localhost:3005/auth/login', {
        provider,
        accessToken: provider === 'google' ? credentialResponse.credential : credentialResponse.accessToken,
      });

      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const responseGoogle = (response) => {
    handleLoginSuccess(response, 'google');
  };

  const responseFacebook = (response) => {
    handleLoginSuccess(response, 'facebook');
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <div className="login-buttons">
        <GoogleOAuthProvider clientId="152815780302-kerpkd0m4l1og80erq2c7j2754bg3rqt.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => console.error('Google login failed')}
            className="google-login-button"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login;