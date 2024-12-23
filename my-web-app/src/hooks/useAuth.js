import { useState, useEffect } from 'react';
import { parseIdToken, handleTokenExpiration } from "../aws/cognitoService.js"; 

const useAuth = (currentUser) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [idToken, setIdToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            let token = null;
            
            // Check if currentUser has a token, otherwise use localStorage
            if (currentUser?.id_token) {
                token = currentUser.id_token;
            } else {
                token = localStorage.getItem('idToken');
            }

            if (token) {
                try {
                    // Call the function to handle token expiration and refresh
                    const result = await handleTokenExpiration();

                    if (result && result.idToken) {
                        // Token was refreshed, set the new token and user attributes
                        setIdToken(result.idToken);
                        setUserRole(result.userAttributes?.role || null);  // Safe fallback for role
                        setIsAuthenticated(true);
                    } else {
                        // Token is valid, just parse and set the role
                        setIdToken(token);
                        setUserRole(parseIdToken(token)?.role || null); // Safe fallback for role
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error("Error handling token expiration:", error);
                    setIsAuthenticated(false);
                    setUserRole(null);
                    setIdToken(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
                setIdToken(null);
            }

            setIsLoading(false); // Set loading to false once the check is done
        };

        checkToken();
    }, [currentUser]);

    return { isAuthenticated, userRole, idToken, isLoading };
};

export default useAuth;