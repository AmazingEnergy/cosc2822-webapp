import React, {useState} from 'react';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import './profile.scss';

const Profile = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <div className="overflow-x-hidden bg-[#F5F5F5] min-h-screen">
            {/* Header */}
            <div className="flex justify-center mt-6 p-4">
                <h1 className="font-akshar font-bold text-[#3A3A3A] text-[40px]">
                    My Account
                </h1>
            </div>

            {/* Content Layout */}
            <div className="flex flex-row items-start max-w-screen-lg mx-auto mt-4">
                {/* Left Side - 30% */}
                <div className="w-4/10">
                    <LeftSide setActiveSection={setActiveSection}/>
                </div>

                {/* Right Side - 70% */}
                <div className="w-6/10 ml-6">
                    <RightSide activeSection={activeSection}/>
                </div>
            </div>
        </div>
    );
};

export default Profile;
