// Color template based on the provided palette
export const colors = {
  // Primary colors from template
  white: '#FFFFFF',
  black: '#000000',
  
  // Blue tones
  primaryBlue: '#0066FF',      // Bright blue (main color)
  cyan: '#00CCFF',              // Bright cyan
  darkBlue: '#000099',          // Dark blue/navy
  lightBlue: '#6699FF',         // Light blue
  lavender: '#9999FF',          // Light lavender/periwinkle
  
  // Grays
  lightGray: '#E8E8E8',         // Light gray
  mediumGray: '#808080',        // Medium gray
  darkGray: '#333333',          // Dark gray/charcoal
  
  // Backgrounds
  lightBackground: '#F5F5F5',
  
  // Status colors
  error: '#FF4444',
  success: '#44BB44',
  warning: '#FFAA00',
};

// Gradients
export const gradients = {
  primaryGradient: `linear-gradient(135deg, ${colors.primaryBlue} 0%, ${colors.cyan} 100%)`,
  buttonHover: `linear-gradient(135deg, ${colors.primaryBlue} 0%, ${colors.lightBlue} 100%)`,
};
