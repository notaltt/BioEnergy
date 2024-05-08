import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const CustomIconButton = ({ onPress }) => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  `;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <SvgXml xml={svgIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 10, // Add borderRadius to make it visible
  },
});

export default CustomIconButton;
