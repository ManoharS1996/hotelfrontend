import React from 'react';
import styled from 'styled-components/native';
import { Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Container for all social icons
const SocialContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

// Single social icon button
const SocialIconWrapper = styled.TouchableOpacity`
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

const socialPlatforms = [
  { name: 'facebook', color: '#3b5998', url: 'https://facebook.com' },
  { name: 'google', color: '#db4437', url: 'https://google.com' },
  { name: 'twitter', color: '#1da1f2', url: 'https://twitter.com' },
];

export const SocialIcons = () => {
  const handleSocialPress = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <SocialContainer>
      {socialPlatforms.map((platform) => (
        <SocialIconWrapper
          key={platform.name}
          onPress={() => handleSocialPress(platform.url)}
          style={{
            marginHorizontal: 10,
            elevation: 3, // Android shadow
            shadowColor: '#000', // iOS shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <FontAwesome name={platform.name} size={24} color={platform.color} />
        </SocialIconWrapper>
      ))}
    </SocialContainer>
  );
};
