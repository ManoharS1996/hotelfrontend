import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Popup } from '../components/PopupMessage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://192.168.29.87:5000/api/auth/forgot-password', { email });
      setPopupVisible(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Forgot Password</Title>

        <Input
          label="Email"
          placeholder="Enter your registered email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />

        <Button
          title="Send OTP"
          onPress={handleForgotPassword}
          loading={loading}
        />

        <LinkText onPress={() => navigation.navigate('Login')}>
          Back to Login
        </LinkText>

        <Popup
          isVisible={popupVisible}
          title="OTP Sent"
          message="An OTP has been sent to your email. Please check your inbox."
          onClose={() => {
            setPopupVisible(false);
            navigation.navigate('ResetPassword', { email });
          }}
        />
      </Content>
    </Container>
  );
};

export default ForgotPasswordScreen;