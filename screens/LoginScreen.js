import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Popup } from '../components/PopupMessage';
import { SocialIcons } from '../components/SocialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/config';
import { Switch } from 'react-native';

const Container = styled.ImageBackground.attrs({
  source: require('../assets/auth-bg.jpg'),
  resizeMode: 'cover',
})`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Content = styled.View`
  background-color: rgba(30, 39, 46, 0.9);
  padding: 25px;
  border-radius: 10px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: #fff;
`;

const LinkText = styled.Text`
  color: #3498db;
  text-align: center;
  margin-top: 15px;
`;

const ErrorText = styled.Text`
  color: #e74c3c;
  text-align: center;
  margin-bottom: 15px;
  padding: 5px;
  border-radius: 5px;
`;

const RememberMeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const RememberMeText = styled.Text`
  color: #fff;
  margin-left: 10px;
`;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        const savedPassword = await AsyncStorage.getItem('rememberedPassword');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (err) {
        console.error('Failed to load saved credentials', err);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        { email, password },
        { timeout: API_CONFIG.TIMEOUT }
      );

      // Save credentials if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
      }

      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userEmail', email);

      setPopupMessage('Login successful!');
      setPopupVisible(true);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (platform, email) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SOCIAL_LOGIN}`,
        { platform, email },
        { timeout: API_CONFIG.TIMEOUT }
      );

      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userEmail', email);

      setPopupMessage(`${platform} login successful!`);
      setPopupVisible(true);
    } catch (err) {
      console.error('Social login error:', err);
      setError(err.response?.data?.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Welcome Back</Title>

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />

        <RememberMeContainer>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: '#767577', true: '#3498db' }}
            thumbColor={rememberMe ? '#f4f3f4' : '#f4f3f4'}
          />
          <RememberMeText>Remember Me</RememberMeText>
        </RememberMeContainer>

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        <LinkText onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </LinkText>

        <LinkText onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register
        </LinkText>

        <SocialIcons onSocialPress={handleSocialLogin} />
      </Content>

      <Popup
        isVisible={popupVisible}
        title="Success"
        message={popupMessage}
        onClose={() => {
          setPopupVisible(false);
          navigation.replace('Home');
        }}
      />
    </Container>
  );
};

export default LoginScreen;