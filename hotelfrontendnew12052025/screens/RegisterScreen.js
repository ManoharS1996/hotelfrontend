import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Popup } from '../components/PopupMessage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_CONFIG } from '../config/config';

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 25,
  },
})`
  background-color: rgba(30, 39, 46, 0.9);
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: #fff;
`;

const FormContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
`;

const ErrorText = styled.Text`
  color: #e74c3c;
  margin-bottom: 10px;
  text-align: center;
`;

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        name,
        email,
        phone,
        password,
      });

      setPopupVisible(true);

    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Create Account</Title>
        <FormContainer>
          <Input 
            label="Full Name" 
            placeholder="Enter your full name" 
            value={name} 
            onChangeText={setName} 
          />
          <Input 
            label="Email" 
            placeholder="Enter your email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            label="Phone Number" 
            placeholder="Enter your phone number" 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad"
          />
          <Input 
            label="Password" 
            placeholder="Enter your password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
          />
          <Input 
            label="Confirm Password" 
            placeholder="Confirm your password" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            secureTextEntry
          />
          
          {error ? <ErrorText>{error}</ErrorText> : null}

          <Button 
            title="Register" 
            onPress={handleRegister} 
            loading={loading} 
          />
        </FormContainer>
      </Content>

      <Popup
        isVisible={popupVisible}
        title="Registration Successful"
        message="You can now log in."
        onClose={() => {
          setPopupVisible(false);
          navigation.navigate('Login');
        }}
      />
    </Container>
  );
};

export default RegisterScreen;
