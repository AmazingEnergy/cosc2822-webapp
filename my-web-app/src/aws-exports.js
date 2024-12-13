// install amplify: npm install aws-amplify
import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'us-east-1', // Replace with your Cognito region
        userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your User Pool ID
        userPoolWebClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
    },
});
