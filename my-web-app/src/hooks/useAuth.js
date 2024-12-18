import { useState, useEffect } from 'react';
import { parseIdToken } from "../aws/cognitoService.js"; 

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('idToken');

        if (token) {
            try {
                const userAttributes = parseIdToken(token); 
                const role = userAttributes.role; 

                setIsAuthenticated(true);
                setUserRole(role);
            } catch (error) {
                console.error("Error parsing token:", error);
                setIsAuthenticated(false);
                setUserRole(null);
            }
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);

    return { isAuthenticated, userRole };
};

export default useAuth;