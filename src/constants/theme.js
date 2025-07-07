import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

// Common colors
export const COLORS = {
  primary: '#642684',
  white: '#ffffff',
  black: '#151C2A',
  gray: '#fafafa',
  lightGray: '#f6f2ff',
  shadow: '#CFECF8',
};

// Common dimensions
export const DIMENSIONS = {
  screenWidth: width,
  screenHeight: height,
  padding: {
    small: 10,
    medium: 16,
    large: 20,
    xlarge: 25,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 50,
  },
};

// Common font sizes
export const FONTS = {
  sizes: {
    small: 12,
    medium: 15,
    large: 18,
    xlarge: 21,
    xxlarge: 24,
  },
  weights: {
    normal: 'normal',
    medium: '500',
    semibold: '600',
    bold: 'bold',
  },
};

// Common gradients
export const GRADIENTS = {
  primary: ["#642684", "#ffffff", "#ffffff"],
  secondary: ["#ffffff", "#f6f2ff"],
};