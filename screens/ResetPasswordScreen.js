import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Popup } from '../components/PopupMessage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

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

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://192.168.29.87:5000/api/auth/reset-password', {
        email: route.params?.email,
        otp,
        newPassword,
      });

      setPopupVisible(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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