import React, { useState, useEffect } from "react";
import "./HeaderAdvanced.scss";
import logo from '../../assets/imgs/hero-sec-image/logo.png';
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import { oauthService } from "../../services/oauthService";

const HeaderTransparent = () => {
  const navigate = useNavigate();
  const { token, setUser, setToken, user } = useStateContext();

  const logStatus = Boolean(token) || Boolean(user);

  const handleLogout = async () => {
    try {
      await oauthService.logout();
      setUser(null);
      setToken(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      setUser(null);
      setToken(null);
      navigate('/login');
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
        
        {!logStatus ? (
          <div className="partition-nav-3">
            <div className="nav-login-btn-header-advanced" onClick={() => navigate("/login")}>
              SignUp/ SignIn
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user?.avatar && (
              <img 
                src={user.avatar} 
                alt="Profile" 
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
            )}
            <span><b>{user?.email || user?.name}</b></span>
            <button 
              onClick={handleLogout}
              style={{ 
                marginLeft: '10px', 
                padding: '5px 10px', 
                background: '#ff4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTransparent;