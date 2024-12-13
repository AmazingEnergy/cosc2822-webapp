//install: npm install amazon-cognito-identity-js aws-sdk

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'YOUR_USER_POOL_ID', // e.g., us-east-1_ExaMPle
  ClientId: 'YOUR_APP_CLIENT_ID', // e.g., 1h2k3l4m5n6o7p8q9r0
};

const userPool = new CognitoUserPool(poolData);

// Register a new user
export const registerUser = (email, password) =>
  new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        reject(err.message || JSON.stringify(err));
        return;
      }
      resolve(result.user);
    });
  });

// Log in an existing user
export const loginUser = (email, password) =>
  new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        resolve(result.getIdToken().getJwtToken());
      },
      onFailure: (err) => {
        reject(err.message || JSON.stringify(err));
      },
    });
  });

// Request password reset
export const requestPasswordReset = (email) =>
  new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err.message || JSON.stringify(err)),
    });
  });

// Confirm password reset
export const confirmPasswordReset = (email, code, newPassword) =>
  new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err.message || JSON.stringify(err)),
    });
  });
