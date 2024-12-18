import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from '../../hooks/useAuth.js';

import "./header.scss"; 

const Header = () => {
    const { isAuthenticated, userRole } = useAuth();
    //const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header className="flex justify-between items-center p-4 pl-6 bg-white shadow-md border border-solid border-[#D9D9D9]">
            <Link to="/">
                <div className="text-[#D07373] text-[36px] font-bold font-akshar">
                    EASYSTORE
                </div>
            </Link>
            <nav className="flex space-x-4">
                {!isAuthenticated ? (
                    // Render Sign In and Register buttons
                    <>
                        <Link
                            to="/login"
                            className="px-4 py-2 text-[#D07373] text-[16px] bg-white border border-solid border-[#E89F71] rounded-[50px] hover:bg-[#D07373] hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 text-[#E89F71] text-[16px] bg-[#F9F1E7] rounded-[50px] hover:bg-[#E89F71] hover:text-white transition-colors"
                        >
                            Register
                        </Link>
                    </>
                ) : (
                    // Render Cart, Profile, and Logout buttons for logged-in users
                    <>
                        <Link
                            to="/cart"
                            className="px-2 py-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                fill="#D07373"
                                className="w-6 h-6"
                            >
                                <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                            </svg>
                        </Link>
                        <Link
                            to="/profile"
                            className="px-2 py-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="w-6 h-6"
                            >
                                <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
                            </svg>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
