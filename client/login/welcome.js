import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import logo from '../images/nouser.jpg';
import socketClient from '../api/socket';
import { showError, showWarning } from "../contexts/common";
import { BuildChatList } from "../components/messaging/chat";
import { menuItems, schemaList } from "../constant";

const HomePage = ({ tabs, activeIndex, handleClickTab, handleCloseTab }) => {
    const { username: authenticatedUser } = useParams();
    const { username } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const isAuthenticated = localStorage.getItem('isAuthenticated');

    useEffect(() => {
        console.log('loggedin', username);
        socketClient.emit('login', username);
    }, [username]);

    useEffect(() => {
        const handleReceiveMessage = otheruser => console.log(`${otheruser} is active.`);
        socketClient.on('user_joined', handleReceiveMessage);
        return () => socketClient.off('user_joined', handleReceiveMessage);
    }, []);

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        showError('Something went wrong!');
        console.error('Authentication mismatch:', { isAuthenticated, authenticatedUser, username });
        isAuthenticated !== 'true' && showWarning('Please login first');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui container parent-container" style={{ paddingBottom: '1rem' }}>
            <Welcome username={username} />
        </div>
    );
};

export const HomePageHeader = () => {
    const { username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        closeDropdown();
        window.location.href = '/';
    };

    const toggleSidebar = () => setSidebarVisible(prev => !prev);
    const closeSidebar = () => setSidebarVisible(false);
    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const closeDropdown = () => setDropdownOpen(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="ui menu main-header sticky-header">
            <SideBar
                ref={sidebarRef}
                sidebarVisible={sidebarVisible}
                closeSidebar={closeSidebar}
                onLogout={handleLogout}
            />
            <div className="center-header">
                <i
                    className="bars icon big"
                    style={{ cursor: 'pointer', marginRight: '1rem', color: "#fff" }}
                    onClick={toggleSidebar}
                />
                <img src={logo} alt="user" className="image-logo" />
                <h2 className="child-header" style={{ marginLeft: "0.5rem" }}>Contact Manager</h2>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", position: "relative" }}>
                    <div
                        ref={dropdownRef}
                        style={{ position: "relative", marginRight: "0.5rem", cursor: 'pointer' }}
                        title={username}
                    >
                        <img src={profilepicture || user} alt="User" className="user-profile" onClick={toggleDropdown} />
                        {dropdownOpen && (
                            <UserDropdown
                                username={username}
                                email={email}
                                onLogout={handleLogout}
                                closeDropdown={closeDropdown}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SideBar = React.forwardRef(({ sidebarVisible, closeSidebar, onLogout }, sidebarRef) => {
    const { username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    return (
        <div ref={sidebarRef} className={`custom-sidebar ${sidebarVisible ? 'show' : ''}`}>
            <div className="sidebar-header">
                <i className="close icon close-sidebar" onClick={closeSidebar} />
                <div className="sidebar-user">
                    <img src={profilepicture || user} alt="User" className="user-profile" />
                    <div className="sidebar-user-info">
                        <div style={{ fontWeight: "600", fontSize: "1.4rem" }}>{username}</div>
                        <div style={{ color: "#fffc" }}>{email}</div>
                    </div>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            <div className="sidebar-scrollable">
                <div className="sidebar-menu">
                    <Link
                        to={`/welcome/${username}`}
                        className="sidebar-menu-item"
                        onClick={() => {
                            closeSidebar();
                        }}
                    >
                        <i className="home icon"></i>
                        <span style={{ marginLeft: "0.75rem" }}>Home</span>
                    </Link>
                    {schemaList.map(({ key, collection, icon, label }) => collection && (
                        <Link
                            key={label}
                            to={`/getalldata/${collection}`}
                            state={{ collection }}
                            className="sidebar-menu-item"
                            onClick={() => {
                                // navigate(`/getalldata/${collection}`, { state: { collection } });
                                closeSidebar();
                            }}
                        >
                            <i className={`${icon} icon`}></i>
                            <span style={{ marginLeft: "0.75rem" }}>{label}</span>
                        </Link>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-divider"></div>
                    <div className="sidebar-logout" onClick={onLogout}>
                        <i className="logout icon"></i>
                        <span style={{ marginLeft: "0.75rem" }}>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

const UserDropdown = ({ username, email, onLogout, closeDropdown }) => {
    return (
        <div className="dropdown-popup">
            <div className="dropdown-popup-header">
                <div style={{ fontWeight: "600", fontSize: "1.25rem", color: "#333" }}>{username}</div>
                <div style={{ fontSize: "1rem", color: "#666" }}>{email}</div>
            </div>
            <div className="dropdown-popup-menu">
                {menuItems.map(({ label, icon, path, action }, index) => (
                    <div key={label + index} style={{ marginTop: index === 0 || index === menuItems.length - 1 ? "0" : "0.75rem" }}>
                        {action === "logout" ? (
                            <>
                                <div className="dropdown-popup-splitbar"></div>
                                <Link to="/" style={{ display: "block" }} onClick={onLogout}>
                                    <i className={`${icon} icon`}></i> {label}
                                </Link>
                            </>
                        ) : action === "home" ? (
                            <Link
                                to={`/welcome/${username}`}
                                style={{ display: "block" }}
                                onClick={() => {
                                    closeDropdown();
                                }}
                            >
                                <i className={`${icon} icon`}></i> {label}
                            </Link>
                        ) : (
                            <Link to={`${path}${username}`} style={{ display: "block" }} onClick={closeDropdown}>
                                <i className={`${icon} icon`}></i> {label}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Welcome = ({ username }) => (
    <div className="ui main container">
        <div className="ui card fluid">
            <div className="content">
                <h1 className="ui header" style={{ color: '#1b1c1d', marginBottom: "0.5rem" }}>
                    Welcome back, {username}!
                </h1>
                <p>Here is your user dashboard. You can view, manage, and explore records as needed.</p>
            </div>
        </div>

        <div className="ui segment" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
            <BuildChatList type="chat" origin="welcome" />
        </div>
    </div>
);

export default HomePage;