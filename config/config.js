const API_CONFIG = {
  BASE_URL: 'http://192.168.29.87:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      SOCIAL_LOGIN: '/auth/social-login'
    },
    USER: {
      PROFILE: '/users/me',
      UPDATE: '/users/me'
    }
  },
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const SOCIAL_CONFIG = {
  FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',
  GOOGLE_WEB_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
  TWITTER_CONSUMER_KEY: 'YOUR_TWITTER_KEY',
  TWITTER_CONSUMER_SECRET: 'YOUR_TWITTER_SECRET',
  REDIRECT_URIS: {
    FACEBOOK: 'fb://facebook',
    GOOGLE: 'com.googleusercontent.apps.yourapp:/oauth2redirect/google',
    TWITTER: 'yourapp://'
  }
};

const APP_CONFIG = {
  APP_NAME: 'AuthApp',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

export { API_CONFIG, SOCIAL_CONFIG, APP_CONFIG };