import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import CryptoJS from "crypto-js";

const USER_POOL_ID = import.meta.env.VITE_AWS_USER_POOL_ID;
const REGION = import.meta.env.VITE_AWS_REGION;
const CLIENT_ID = import.meta.env.VITE_AWS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AWS_CLIENT_SECRET;

console.log("User  Pool ID:", USER_POOL_ID);
console.log("Region:", REGION);
console.log("Client ID:", CLIENT_ID);
console.log("Client Secret:", CLIENT_SECRET);

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

// Function to calculate SECRET_HASH
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
      return response.AuthenticationResult;
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        throw new Error("Incorrect username or password.");
      } else if (error.name === "UserNotFoundException") {
        throw new Error("User does not exist.");
      } else if (error.name === "MFARequiredException") {
        return { mfaRequired: true, session: error.Session };
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
        console.log("Password reset confirmed successfully.");
    } catch (error) {
        console.error("Error confirming password reset:", error);
        throw new Error(error.message || "Error confirming password reset.");
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
        // Send the command to Cognito
        await cognitoClient.send(command);
        console.log("Reset code sent successfully.");
    } catch (error) {
        console.error("Error sending reset code:", error);
        throw new Error(error.message || "Error sending reset code.");
    }
};