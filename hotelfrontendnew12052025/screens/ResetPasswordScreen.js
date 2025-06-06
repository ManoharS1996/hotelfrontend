import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Popup } from '../components/PopupMessage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_CONFIG } from '../config/config';

const Container = styled.View`
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

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD}`,
        {
          [route.params.method]: route.params[route.params.method],
          otp,
          newPassword,
          method: route.params.method
        },
        { timeout: API_CONFIG.TIMEOUT }
      );

      setPopupVisible(true);
      setError('');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Reset Password</Title>

        <Input
          label="OTP"
          placeholder="Enter the OTP you received"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          error={error && !otp ? error : ''}
        />

        <Input
          label="New Password"
          placeholder="Enter your new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          error={error && !newPassword ? error : ''}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={error && !confirmPassword ? error : ''}
        />

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
        />

        <Popup
          isVisible={popupVisible}
          title="Success"
          message="Your password has been reset successfully."
          onClose={() => {
            setPopupVisible(false);
            navigation.navigate('Login');
          }}
        />
      </Content>
    </Container>
  );
};

export default ResetPasswordScreen;
