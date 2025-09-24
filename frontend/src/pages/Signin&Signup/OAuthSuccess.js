import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthService } from '../../services/oauthService';
import { useStateContext } from '../../contexts/NavigationContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const { user } = await oauthService.getProfile();
        setUser(user);
        
        // Show success message for 2 seconds then redirect
        setTimeout(() => {
          navigate('/'); // Redirect to home page
        }, 2000);
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [setUser, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>Completing Google Sign In...</h2>
        <p>Please wait while we set up your account.</p>
        <div style={{ 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 2s linear infinite',
          margin: '20px'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2 style={{ color: 'green' }}>✅ Successfully signed in with Google!</h2>
      <p>Redirecting you to the home page...</p>
    </div>
  );
};

export default OAuthSuccess;