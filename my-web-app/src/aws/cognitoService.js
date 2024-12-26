import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import * as CryptoJS from "crypto-js";

const USER_POOL_ID = import.meta.env.VITE_AWS_USER_POOL_ID;
const REGION = import.meta.env.VITE_AWS_REGION;
const CLIENT_ID = import.meta.env.VITE_AWS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AWS_CLIENT_SECRET;

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

export const parseIdToken = (idToken) => {
  if (!idToken || idToken.trim() === "") {
    throw new Error("idToken is empty or invalid.");
  }

  try {
    // Split the token into header, payload, and signature
    const parts = idToken.split('.');

    if (parts.length !== 3) {
      throw new Error("Invalid JWT token.");
    }

    // Decode and parse the payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  // URL-safe Base64 to standard Base64
    const jsonPayload = atob(base64); // Decode Base64 to UTF-8
    const decodedToken = JSON.parse(jsonPayload);

    const userAttributes = {
      username: decodedToken["cognito:username"] || null,
      email: decodedToken["email"] || null,
      exp: decodedToken["exp"] || null,
    };


    //console.log(decodedToken);

    const groups = decodedToken["cognito:groups"] || [];
    let role = "customer"; // Default role

    if (groups.includes("admin")) {
      role = "admin";
    } else if (groups.includes("customer")) {
      role = "customer";
    }

    userAttributes.role = role;

    return userAttributes;
  } catch (error) {
    console.error("Error parsing idToken:", error);
    throw new Error("Failed to parse idToken.");
  }
};


export function calculateSecretHash(username, clientId = CLIENT_ID, clientSecret = CLIENT_SECRET) {
  if (!username || !clientId || !clientSecret) {
    throw new Error("Missing required parameters for secret hash calculation.");
  }
  const message = username + clientId;
  return CryptoJS.HmacSHA256(message, clientSecret).toString(CryptoJS.enc.Base64);
}

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

    // Log the response to ensure IdToken is present
    console.log("Cognito Response:", response);

    const idToken = response.AuthenticationResult.IdToken;
    const refreshToken = response.AuthenticationResult.RefreshToken;
    const accessToken = response.AuthenticationResult.AccessToken;

    if (!idToken) {
      console.error("idToken is missing in the response");
      throw new Error("Authentication failed: No idToken received.");
    }

    // Store tokens in localStorage
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('username', username);  

    // Parse the IdToken
    const userAttributes = parseIdToken(idToken);  // Parse idToken to get user attributes

    return {
      idToken,
      accessToken,
      user: userAttributes,
    };
  } catch (error) {
    if (error.name === "NotAuthorizedException") {
      throw new Error("Incorrect username or password.");
    } else if (error.name === "UserNotFoundException") {
      throw new Error("User does not exist.");
    }
    throw error;
  }
};


export const register = async (username, password, email) => {
  const secretHash = calculateSecretHash(username);
  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
    SecretHash: secretHash,
  };

  try {
    const command = new SignUpCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error(error.message || "Registration failed.");
  }
};

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
    throw new Error(error.message || "Confirmation failed.");
  }
};

export const resetPassword = async (username, verificationCode, newPassword) => {
  const secretHash = calculateSecretHash(username);
  const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: verificationCode,
      Password: newPassword,
      SecretHash: secretHash,
  });

  try {
      await cognitoClient.send(command);
  } catch (error) {
      throw new Error(error.message || "Error confirming password reset.");
  }
};

export const changePassword = async (accessToken, oldPassword, newPassword) => {
  const command = new ChangePasswordCommand({
    AccessToken: accessToken,
    PreviousPassword: oldPassword,
    ProposedPassword: newPassword,
  });

  try {
    await cognitoClient.send(command);
  } catch (error) {
    // Check for specific error codes
    if (error.name === "NotAuthorizedException") {
      throw new Error("The old password is incorrect. Please try again.");
    } else if (error.name === "InvalidParameterException") {
      throw new Error("The new password does not meet the required criteria.");
    } else {
      throw new Error(error.message || "Error changing password");
    }
  }
};

export const sendResetCode = async (username) => {
  const secretHash = calculateSecretHash(username);
  const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
      SecretHash: secretHash,
  });

  try {
      await cognitoClient.send(command);
  } catch (error) {
      throw new Error(error.message || "Error sending reset code.");
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const username = localStorage.getItem('username');  // Retrieve username from localStorage

  if (!refreshToken || !username) {
    throw new Error("Refresh token or username is not available.");
  }

  const secretHash = calculateSecretHash(username);  // Use the stored username for the hash

  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
      SECRET_HASH: secretHash,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    const { IdToken } = response.AuthenticationResult;
    localStorage.setItem('idToken', IdToken);
    console.log("Token refreshed successfully. Reloading the page...");
    window.location.reload();

    const userAttributes = parseIdToken(IdToken);

    return {
      idToken: IdToken,
      user: userAttributes,
    };
  } catch (error) {
    console.error("Error refreshing idToken:", error);
    throw new Error("Failed to refresh idToken: " + error.message);
  }
};

// Function to handle token expiration
export const handleTokenExpiration = async () => {
  try {
    const currentToken = localStorage.getItem('idToken');
    if (!currentToken) {
      console.error("No idToken found in localStorage.");
      return { idToken: null, userAttributes: null, isExpired: false }; // Return safe default
    }

    const decodedToken = parseIdToken(currentToken);
    const exp = decodedToken.exp;
    //console.log("exp = " +exp);

    const isExpired = Date.now() >= exp * 1000; // Convert to milliseconds

    if (isExpired) {
      console.log("Token is expired. Refreshing...");
      const { idToken, user } = await refreshToken();
      //reload page for me
      return { idToken, userAttributes: user, isExpired: true };
    } else {
      //console.log("Token is still valid.");
      return { idToken: currentToken, userAttributes: parseIdToken(currentToken), isExpired: false };
    }
  } catch (error) {
    console.error("Error handling token expiration:", error);
    return { idToken: null, userAttributes: null, isExpired: false }; // Return safe default in case of error
  }
};
