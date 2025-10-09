import React, { useState } from "react";
import "./HeaderAdvanced.scss";
import logo from '../../assets/imgs/hero-sec-image/logo.png'
import noData from '../../assets/imgs/error-displayers/no-data.png'
import {SlArrowDown} from 'react-icons/sl'
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import { oauthService } from "../../services/oauthService";
import Cookies from "js-cookie";

const HeaderAdvanced = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, setUser, setToken, user } = useStateContext();
    const [visibility, setVisibility] = useState(false);

    // Check if user is authenticated (either regular login or OAuth)
    const isAuthenticated = Boolean(token) || Boolean(user);
    
    // Hide user section on auth pages (login/signup pages)
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const handleLogout = async () => {
        try {
            if (user?.provider === 'google') {
                await oauthService.logout();
            }
            
            // Clear all cookies and localStorage
            Cookies.remove("_auth");
            Cookies.remove("_user");
            localStorage.clear();

            // Clear state
            setUser(null);
            setToken(null);
            setVisibility(false);
            
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            setUser(null);
            setToken(null);
            navigate('/');
        }
    };

    return (
        <div className="nav-container-header-adv">
            {/* this is for the company logo */}
            <div className="partition-nav-1">
                <span className="brand-text-header-adv">Central Pet Care</span>
            </div>
            {/* this is for the link section */}
            <div className="partition-nav-2-header-adv">
                <span className="nav-links-header-advanced" onClick={() => navigate("/")}>Home</span>
                <span className="nav-links-header-advanced" onClick={() => navigate("/services")}>Services</span>
                <span className="nav-links-header-advanced">Contact</span>
                <span className="nav-links-header-advanced" onClick={() => {
                    navigate("/store")
                }}>Store</span>

                {/* Only show auth section if NOT on auth pages */}
                {!isAuthPage && (
                    !isAuthenticated ? (
                        <div className="show">
                            <div className="nav-login-btn-header-advanced" onClick={() => navigate("/register")}>Signup</div>
                            <div className="nav-login-btn-header-advanced" onClick={() => navigate("/login")}>Signin</div>
                        </div>
                    ) : (
                        <div className="partition-nav-3 show">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="profile-cpt-image" />
                            ) : (
                                <img src={noData} alt="" className="profile-cpt-image" />
                            )}
                            <button className="drop-btn-header-adv" onClick={() => {setVisibility(!visibility)}}>
                                <SlArrowDown className="arrow-header-adv"/>
                            </button>
                            <div className={visibility ? `btn-section-header-adv` : `btn-section-header-adv hide`}>
                                <span className="scroller-btns">Profile</span>
                                <span className="scroller-btns" onClick={handleLogout}>Logout</span>
                                <span className="scroller-btns" onClick={() => {
                                    navigate("/account/myOrders")
                                }}>MyOrders</span>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default HeaderAdvanced;