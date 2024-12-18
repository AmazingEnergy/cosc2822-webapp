import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
  } from "@aws-sdk/client-cognito-identity-provider";
  import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
  import { HmacSHA256 } from "crypto-js";
  
  const USER_POOL_ID = import.meta.env.AWS_USER_POOL_ID;
  const REGION = import.meta.env.AWS_REGION;
  const CLIENT_ID = import.meta.env.AWS_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.AWS_CLIENT_SECRET;
  
  const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID,
  };
  
  const userPool = new CognitoUserPool(poolData);
  
  const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });
  
  export function calculateSecretHash(username, clientId = CLIENT_ID, clientSecret = CLIENT_SECRET) {
    if (!username || !clientId || !clientSecret) {
      throw new Error("Missing required parameters for secret hash calculation.");
    }
    const message = username + clientId;
    return HmacSHA256(message, clientSecret).toString();
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
    const cognitoUser  = new CognitoUser ({ Username: username, Pool: userPool });
    
    return new Promise((resolve, reject) => {
      cognitoUser .confirmPassword(verificationCode, newPassword, {
        onSuccess() {
          console.log("Password reset confirmed successfully.");
          resolve("Your password has been successfully reset.");
        },
        onFailure(err) {
          console.error("Password reset confirmation error:", err.message || JSON.stringify(err));
          reject(new Error(err.message || "Error confirming password reset."));
        },
      });
    });
  };
  