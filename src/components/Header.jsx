import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo1.png";
import "../assets/styles/Header.css";
import { Link } from 'react-router-dom';

function Header({
    showProfile = false,
    userName = "",
    showReport = false,
    onLogoutClick,
}) {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="app-header">
            <div
                className="header-left"
                onClick={() => navigate("/selectinterview")}
            >
                <Link to='/selectinterview'>
                    <img src={logo} alt="logo" className="header-logo" />
                </Link>
            </div>

            <div className="header-right">

                <NavLink
                    to="/selectinterview"
                    className={({ isActive }) =>
                        isActive
                            ? "header-secondary-btn active-link"
                            : "header-secondary-btn"
                    }>Home
                </NavLink>

                {/* Interview Report Outside */}
                {showReport && (
                    <NavLink
                        to="/report"
                        className={({ isActive }) =>
                            isActive
                                ? "header-secondary-btn active-link"
                                : "header-secondary-btn"
                        }
                    >
                        Interview Report
                    </NavLink>
                )}

                {/* Profile Section */}
                {showProfile && (
                    <div className="profile-wrapper" ref={dropdownRef}>
                        <div
                            className="profile-section"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <div className="profile-avatar">
                                {userName?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="profile-name">
                                {userName?.charAt(0).toUpperCase() +
                                    userName?.slice(1)}
                            </span>
                            <span>
                                <i class="bi bi-caret-down-fill"></i>
                            </span>
                        </div>

                        {openDropdown && (
                            <div className="profile-dropdown">
                                <button
                                    className="dropdown-item logout"
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        onLogoutClick && onLogoutClick();
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header >
    );
}

export default Header;
