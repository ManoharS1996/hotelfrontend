import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Popup } from '../components/PopupMessage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_CONFIG } from '../config/config';

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

const MethodSelector = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  justify-content: space-around;
`;

const MethodButton = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${props => props.active ? '#3498db' : 'transparent'};
  border: 1px solid #3498db;
`;

const MethodButtonText = styled.Text`
  color: ${props => props.active ? '#fff' : '#3498db'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const LinkText = styled.Text`
  color: #3498db;
  text-align: center;
  margin-top: 15px;
`;

const ForgotPasswordScreen = () => {
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (method === 'email' && !email) {
      setError('Please enter your email');
      return;
    }

    if (method === 'phone' && !phone) {
      setError('Please enter your phone number');
      return;
    }

    if (method === 'email' && !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD}`, 
        { 
          [method]: method === 'email' ? email : phone,
          method 
        },
        { timeout: API_CONFIG.TIMEOUT }
      );
      
      setPopupVisible(true);
      setError('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Forgot Password</Title>

        <MethodSelector>
          <MethodButton 
            active={method === 'email'}
            onPress={() => setMethod('email')}
          >
            <MethodButtonText active={method === 'email'}>Email</MethodButtonText>
          </MethodButton>
          <MethodButton 
            active={method === 'phone'}
            onPress={() => setMethod('phone')}
          >
            <MethodButtonText active={method === 'phone'}>Phone</MethodButtonText>
          </MethodButton>
        </MethodSelector>

        {method === 'email' ? (
          <Input
            label="Email"
            placeholder="Enter your registered email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error && method === 'email' ? error : ''}
          />
        ) : (
          <Input
            label="Phone Number"
            placeholder="Enter your registered phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={error && method === 'phone' ? error : ''}
          />
        )}

        <Button
          title="Send OTP"
          onPress={handleForgotPassword}
          loading={loading}
          disabled={loading}
        />

        <LinkText onPress={() => navigation.navigate('Login')}>
          Back to Login
        </LinkText>

        <Popup
          isVisible={popupVisible}
          title="OTP Sent"
          message={`An OTP has been sent to your ${method === 'email' ? 'email' : 'phone'}. Please check your ${method === 'email' ? 'inbox' : 'messages'}.`}
          onClose={() => {
            setPopupVisible(false);
            navigation.navigate('ResetPassword', { 
              [method]: method === 'email' ? email : phone,
              method 
            });
          }}
        />
      </Content>
    </Container>
  );
};

export default ForgotPasswordScreen;