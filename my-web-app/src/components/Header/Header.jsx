import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.scss";

const Header = () => {
    // const [showCircle, setShowCircle] = useState(false);
    // const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

    const [showDropdown, setShowDropdown] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const navigate = useNavigate()

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavbarToggle = () => {
        setIsOpened(!isOpened);
    };

    const handleOnClick = (e) => {
        e.preventDefault();
        navigate("/ticket")
        
    }

    const location = useLocation();

    useEffect(() => {
        // Reset state when location changes
        setIsOpened(false);
    }, [location]);

    //? HOVER ANIMATION IN HEADER
    // const handleMouseEnter = () => {
    //     setShowCircle(true);
    // };

    // const handleMouseLeave = () => {
    //     setShowCircle(false);
    // };

    // const handleMouseMove = (event) => {
    //     const circle = document.querySelector('.circle');
    //     if (circle) {
    //         const circleWidth = circle.offsetWidth;
    //         const circleHeight = circle.offsetHeight;
    //         const x = event.clientX - circleWidth / 2;
    //         const y = event.clientY - circleHeight / 2;
    //         setCirclePosition({ x, y });
    //     }
    // };

    return (
        <>
            {/* <nav className="top-nav hidden md:block lg:text-[22px] md:text-[18px]">
                <div className="flex w-full items-center">
                    <div className="logo w-1/3">
                        <Link to="/" className="py-1.5">
                            <img
                                className="block object-contain h-9 w-11/12 md:w-5/6"
                                src="./assets/logo/TEDx-logo/TEDx-Black-Short.png"
                            />
                        </Link>
                    </div>
                    <div className="top-items w-1/2 hidden sm:flex lg:justify-around justify-center items-center lg:gap-x-2 gap-x-6 text-nowrap">
                        <div className="relative">
                            <button
                                className="item text-gray-900"
                                aria-expanded="false"
                                onClick={handleDropdownToggle}
                            >
                                <div className="flex items-center gap-x-1">
                                    <span>Diễn Đàn</span>
                                    <svg
                                        className="h-5 w-5 flex-none text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </button>
                            {showDropdown && (
                            <div className="show-down-box absolute mt-3 p-2 overflow-hidden bg-black text-white ring-1 ring-gray-900/5">
                                <div className="p-4">
                                    <div className="group flex flex-col gap-x-6 p-4">
                                        <Link to="#" className="">
                                            TEDxHOCHIMINHCITY 2024
                                        </Link>
                                        <div className="drop-divider"></div>
                                        <div className="drop-sec-text flex flex-col space-y-2">
                                            <p>Sep 21st, 2024</p>
                                            <p>Ho Chi Minh, Viet Nam</p>
                                        </div>
                                    </div>
                                    <div className="group flex flex-col gap-x-6 p-4">
                                        <Link to="#" className="block">
                                            TEDxHOCHIMINHCITY 2023
                                        </Link>
                                        <div className="drop-divider"></div>
                                        <div className="drop-sec-text flex flex-col space-y-2">
                                            <p>Jan 1st, 2023</p>
                                            <p>Ho Chi Minh, Viet Nam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                        <Link to="/" className="item text-gray-900">
                            Thông tin Event
                        </Link>
                        <Link to="about" className="item text-gray-900">
                            Về chúng tôi
                        </Link>
                    </div>
                    <div className="hidden lg:block w-1/3"></div>
                </div>
            </nav> */}
            <nav
                className={`bottom-nav lg:h-[82px] md:h-[72px] h-[62px] px-5 items-center flex justify-between lg:text-[22px] md:text-[18px] text-[14px] lg:px-8 lg:space-x-16 md:space-x-10 text-gray-500  bg-white`}
            >
                <div className="logo flex justify-center items-center">
                    <Link
                        to="/"
                        className="lg:text-[25px] md:text-[20px] transition-all ease-in duration-200 hover:text-gray-900 hover:font-bold"
                    >
                        {/* <h3 className="hidden md:block font-semibold">
                            TEDxHOCHIMINHCITY
                            <span className="font-light">2024</span>
                        </h3> */}
                        <img
                            className="md:h-9 h-5 w-auto"
                            src="/assets/logo/TEDx-logo/TEDx-Black-Short.png"
                        />
                    </Link>
                </div>
                {/* <div className="hidden lg:block second-box"></div> */}
                {/* <div className="bottom-items flex items-center justify-center lg:gap-x-16 md:gap-x-10 gap-x-2 text-nowrap">
                    <Link
                        to="speakers"
                        className="hidden md:block transition-all ease-in duration-200 font-semibold hover:font-bold hover:text-gray-900"
                    >
                        DIỄN GIẢ
                    </Link>
                    <div
                        className="flex items-center"
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                        // onMouseMove={handleMouseMove}
                    >
                        <div className="hidden sm:flex justify-center">
                            <Link to="/">
                                <img
                                    className="block relative h-7 object-contain -translate-x-1/2"
                                    src="./assets/logo/to-tuong-logo/To-tuong-logo-black.png"
                                    alt="TEDX Logo"
                                />
                            </Link>
                        </div>
                        {showCircle && (
                            <div
                                className="circle"
                                style={{
                                    left: circlePosition.x,
                                    top: circlePosition.y,
                                }}
                            ></div>
                        )}
                    </div>
                    <Link
                        to="#"
                        className="hidden md:block transition-all ease-in duration-200 font-semibold hover:font-bold hover:text-gray-900"
                    >
                        ĐỊA ĐIỂM
                    </Link>
                </div> */}
                <Link to="/" className="hidden lg:block m-0">
                    <img
                        className="block relative -translate-x-full h-10 object-contain"
                        src="/assets/logo/to-tuong-logo/To-tuong-logo-black.png"
                        alt="TEDX Logo"
                    />
                </Link>
                <div className="bottom-button flex justify-center items-center">
                    {/* <button
                        className={`ticket-button hidden md:block text-nowrap px-5 py-2 rounded-sm`}
                    >
                        ĐĂNG KÍ VÉ
                    </button> */}
                    <button className="" onClick={handleNavbarToggle}>
                        <i className="fa-sharp fa-regular fa-bars text-[22px] transition-all duration-300 text-[#c30121] hover:text-[#ff002b]"></i>
                    </button>
                </div>
            </nav>
            <div className={`mobile-nav ${isOpened ? "opacity-100 visible" : "opacity-0 invisible"} bg-[#262626] fixed inset-0 transition-all duration-300 h-screen w-full z-[100] lg:px-8 px-5 lg:pt-2 md:pt-1 md:px-6`}>
                <div className={`flex justify-between items-center md:h-[72px] h-[62px] md:mb-10 mb-5`}>
                    <div className="logo min-w-min">
                        <Link to="/" className="inline-block">
                            <img
                                className="block lg:h-10 md:h-9 h-5 w-auto"
                                src="/assets/logo/TEDx-logo/TEDx-White-Short.png"
                            />
                        </Link>
                    </div>
                    <button className={`${isOpened ? "cross-animate" : ""}`} onClick={handleNavbarToggle}>
                        <i className="fa-sharp fa-regular fa-x text-[20px] transition-all duration-300 text-[#c30121] hover:text-[#ff002b]"></i>
                    </button>
                </div>
                <div className={`${isOpened ? "nav-animate" : ""} flex flex-col justify-center font-thin md:text-[25px] lg:gap-y-10 md:gap-y-7 gap-y-5 mb-12 ms-1`}>
                    {/* <Link to="/" className="uppercase text-gray-400">
                        Diễn giả
                    </Link> */}
                    {/* <Link to="/" className="uppercase text-gray-400">
                        Thông tin Event
                    </Link> */}
                    <Link to="/about" className="item uppercase">
                        Về chúng tôi
                    </Link>
                </div>
                <button
                    className={`${isOpened ? "nav-animate" : ""} ticket-button text-center lg:text-[35px] md:text-[25px] text-[22px] px-7 py-3 rounded-sm `}
                    onClick={handleOnClick}
                    //disabled={true}
                >
                    ĐĂNG KÍ VÉ
                </button>
            </div>
        </>
    );
};

export default Header;