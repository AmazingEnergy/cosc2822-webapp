import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    RespondToAuthChallengeCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
    ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import CryptoJS from "crypto-js";

const REGION = "ap-southeast-1"; 
const CLIENT_ID = ""; 
const CLIENT_SECRET = "";

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

// Function to calculate SECRET_HASH
const calculateSecretHash = (username) => {
    const message = username + CLIENT_ID;
    const hash = CryptoJS.HmacSHA256(message, CLIENT_SECRET);
    return CryptoJS.enc.Base64.stringify(hash);
};

// Function to check if a username exists
export const checkUsernameExists = async (username) => {
    const params = {
        UserPoolId: 'ap-southeast-1_rpYD0z06H',
        Filter: `username = "${username}"`,
    };

    try {
        const command = new ListUsersCommand(params);
        const response = await cognitoClient.send(command);
        return response.Users.length > 0; // Returns true if username exists
    } catch (error) {
        console.error("Error checking username existence:", error);
        throw new Error("Error checking username existence. Please try again.");
    }
};

// Function to check if an email exists
export const checkEmailExists = async (email) => {
    const params = {
        UserPoolId: 'ap-southeast-1_rpYD0z06H',
        Filter: `email = "${email}"`,
    };

    try {
        const command = new ListUsersCommand(params);
        const response = await cognitoClient.send(command);
        return response.Users.length > 0; // Returns true if email exists
    } catch (error) {
        console.error("Error checking email existence:", error);
        throw new Error("Error checking email existence. Please try again.");
    }
};

// Login function
export const login = async (username, password) => {
    const secretHash = calculateSecretHash(username);

    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: secretHash,
        },
    };

    try {
        const command = new InitiateAuthCommand(params);
        const response = await cognitoClient.send(command);
        return response.AuthenticationResult; // Contains the access_token
    } catch (error) {
        if (error.name === 'NotAuthorizedException') {
            throw new Error("Incorrect username or password.");
        } else if (error.name === 'User NotFoundException') {
            throw new Error("User  does not exist.");
        } else if (error.name === 'MFARequiredException') {
            return { mfaRequired: true, session: error.Session }; // Return session for MFA
        }
        throw new Error("An error occurred during login.");
    }
};

// Respond to MFA challenge
export const respondToMfaChallenge = async (username, mfaCode, session) => {
    const secretHash = calculateSecretHash(username);
    const params = {
        ClientId: CLIENT_ID,
        ChallengeName: "SMS_MFA",
        Session: session,
        ChallengeResponses: {
            USERNAME: username,
            SMS_MFA_CODE: mfaCode,
            SECRET_HASH: secretHash,
        },
    };

    try {
        const command = new RespondToAuthChallengeCommand(params);
        const response = await cognitoClient.send(command);
        return response.AuthenticationResult; // Contains the access_token
    } catch (error) {
        throw new Error("MFA verification failed.");
    }
};

// Registration function
export const register = async (username, password, email) => {
    const secretHash = calculateSecretHash(username); // Calculate the SECRET_HASH

    const params = {
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email }, // Assuming email is a required attribute
        ],
        SecretHash: secretHash, // Include the SECRET_HASH
    };

    try {
        console.log("Registering user with params:", params); // Log registration parameters
        const command = new SignUpCommand(params);
        await cognitoClient.send(command);
 console.log("Registration successful"); // Log success
    } catch (error) {
        console.error("Registration error:", error); // Log error
        throw new Error(error.message || "Registration failed");
    }
};

// Confirmation function
export const confirmSignUp = async (username, confirmationCode) => {
    const secretHash = calculateSecretHash(username);
    const params = {
        ClientId: CLIENT_ID,
        Username: username,
        ConfirmationCode: confirmationCode,
        SecretHash: secretHash,
    };

    try {
        const command = new ConfirmSignUpCommand(params);
        await cognitoClient.send(command);
    } catch (error) {
        throw new Error(error.message || "Confirmation failed");
    }
};