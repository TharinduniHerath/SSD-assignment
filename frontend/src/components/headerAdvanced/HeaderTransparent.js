import React, { useState, useEffect } from "react";
import "./HeaderAdvanced.scss";
import logo from '../../assets/imgs/hero-sec-image/logo.png';
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import { oauthService } from "../../services/oauthService";
import Cookies from "js-cookie";

const HeaderTransparent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setUser, setToken, user } = useStateContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Check authentication status - including OAuth
  useEffect(() => {
    const checkAuth = async () => {
		console.log('HeaderTransparent: Checking authentication...');
		console.log('HeaderTransparent: Current user from context:', user);
		console.log('HeaderTransparent: Current token from context:', token);
      

	
		    // If we have a user from context (regular login), use it
    if (user) {
      setCurrentUser(user);
      return;
    }
    
    // If we have a token but no user, this might be a regular login
    if (token && !user) {
      console.log('HeaderTransparent: Found token but no user, checking for regular user...');
      try {
        // You might need to create an endpoint to get regular user profile
        // For now, we'll try the OAuth endpoint as fallback
        const response = await oauthService.getProfile();
        if (response.user) {
          console.log('HeaderTransparent: User found via profile check:', response.user);
          setUser(response.user);
          setCurrentUser(response.user);
        }
      } catch (error) {
        console.log('HeaderTransparent: No user found via profile check');
      }
      return;
    }
    
    // If no user and no token, check for OAuth user
    if (!user && !token) {
      try {
        console.log('HeaderTransparent: Checking for OAuth user...');
        const response = await oauthService.getProfile();
        if (response.user) {
          console.log('HeaderTransparent: OAuth user found:', response.user);
          setUser(response.user);
          setCurrentUser(response.user);
        }
      } catch (error) {
        console.log('HeaderTransparent: No OAuth user found');
        setCurrentUser(null);
      }
    }
      // If no user from context, check for OAuth user
      if (!user) {
        try {
          console.log('HeaderTransparent: Checking for OAuth user...');
          const response = await oauthService.getProfile();
          if (response.user) {
            console.log('HeaderTransparent: OAuth user found:', response.user);
            setUser(response.user); // Update context
            setCurrentUser(response.user); // Update local state
          }
        } catch (error) {
          console.log('HeaderTransparent: No OAuth user found');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(user);
      }
    };

    checkAuth();
  }, [user,token, setUser, location.pathname]); // Re-run when user or path changes

  // Use currentUser for authentication check
  const isAuthenticated = Boolean(token) || Boolean(currentUser);
  
  // Hide user section on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-profile-section')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      console.log('HeaderTransparent: Logging out...');
      
      // Handle OAuth logout
      if (currentUser?.provider === 'google') {
        await oauthService.logout();
      }
      
      // Clear all authentication data
      Cookies.remove("_auth");
      Cookies.remove("_user");
      localStorage.removeItem('token');
      localStorage.clear();

      // Clear state
      setUser(null);
      setToken(null);
      setCurrentUser(null);
      setShowDropdown(false);
      
      console.log('HeaderTransparent: Logout complete, redirecting...');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      setUser(null);
      setToken(null);
      setCurrentUser(null);
      setShowDropdown(false);
      navigate('/');
    }
  };

  return (
    <div className="nav-container-header-adv-transparent">
      <div className="partition-nav-1">
        <img src={logo} alt="Company Logo" className="company-logo" />
        <span className="brand-text-header-adv">Central Pet Care</span>
      </div>

      <div className="partition-nav-2-header-adv">
        <span className="nav-links-header-advanced" onClick={() => navigate("/")}>Home</span>
        <span className="nav-links-header-advanced" onClick={() => navigate("/services")}>Services</span>
        <span className="nav-links-header-advanced" onClick={() => navigate("/store")}>Store</span>
        
        {/* Show login/signup button OR user dropdown based on auth status */}
        {!isAuthenticated ? (
          <div className="partition-nav-3">
            <div className="nav-login-btn-header-advanced" onClick={() => navigate("/login")}>
              SignUp/ SignIn
            </div>
          </div>
        ) : (
          <div className="user-profile-section" style={{ position: 'relative' }}>
            {/* User Avatar/Icon */}
            <div 
              className="user-avatar-container"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Profile Image or Default Avatar */}
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt="Profile" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4285F4, #34A853)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {currentUser?.name?.charAt(0) || currentUser?.username?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </div>
              )}
              
              {/* Username/Name Display */}
              <span style={{ 
                fontSize: '14px', 
                color: 'white', 
                fontWeight: '500',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {currentUser?.name || currentUser?.username || 'User'}
              </span>
              
              {/* Dropdown Arrow */}
              <span style={{ 
                fontSize: '10px', 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'transform 0.2s ease',
                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </span>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                background: 'white',
                border: '1px solid #e1e5e9',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                minWidth: '250px',
                zIndex: 1000,
                marginTop: '8px',
                overflow: 'hidden'
              }}>
                {/* User Info Section */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f0f2f5',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    {currentUser?.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt="Profile" 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4285F4, #34A853)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {currentUser?.name?.charAt(0) || currentUser?.username?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '16px', 
                        marginBottom: '2px',
                        color: '#1a202c'
                      }}>
                        {currentUser?.name || currentUser?.username || 'User'}
                      </div>
                      {currentUser?.provider === 'google' && (
                        <div style={{
                          fontSize: '11px',
                          color: '#4285F4',
                          backgroundColor: 'rgba(66, 133, 244, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          Google Account
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Email Display */}
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    wordBreak: 'break-word'
                  }}>
                    {currentUser?.email}
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#dc3545',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#fff5f5'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '16px' }}>🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTransparent;