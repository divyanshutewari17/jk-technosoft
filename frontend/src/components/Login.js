import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();

  // Initialize Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '470400006130560', // Your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0', // Use the latest version
      });

      window.FB.AppEvents.logPageView();
    };
  }, []);

  // Handle Google Login Success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('http://localhost:3005/auth/login', {
        provider: 'google',
        accessToken: credentialResponse.credential,
      });

      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  // Handle Google Login Failure
  const handleGoogleLoginFailure = () => {
    console.error('Google login failed');
  };

  // Handle Facebook Login
  const handleFacebookLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          // User is logged in and granted permissions
          const accessToken = response.authResponse.accessToken;
          handleLoginSuccess(accessToken, 'facebook');
        } else {
          // User cancelled login or did not fully authorize
          console.error('Facebook login failed or was cancelled.');
        }
      },
      { scope: 'public_profile,email' }, // Requested permissions
    );
  };

  // Handle Login Success (for both Google and Facebook)
  const handleLoginSuccess = async (accessToken, provider) => {
    try {
      const { data } = await axios.post('http://localhost:3005/auth/login', {
        provider,
        accessToken,
      });

      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <div className="login-buttons">
        {/* Google Login */}
        <GoogleOAuthProvider clientId={'152815780302-kerpkd0m4l1og80erq2c7j2754bg3rqt.apps.googleusercontent.com'}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            className="google-login-button"
          />
        </GoogleOAuthProvider>

        {/* Facebook Login */}
        <button className="facebook-login-button" onClick={handleFacebookLogin}>
          Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;