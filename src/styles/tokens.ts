// Design Tokens from Figma

export const colors = {
  blueDefault: '#074ED8',
  lightBlue: '#ABC8FF',
  lightBlue2: '#E6EFFF',

  white: '#FFFFFF',
  lightGray1: '#EEEEEE',
  lightGray2: '#E6E6E6',
  lightGray3: '#C8C8C8',
  bgWhiteGray: '#F6F6F6',
  bgBlueGray: '#F3F6FB',
  gray: '#848484',
  dark: '#222222',

  pointRed: '#FF1E1E',
} as const;

export const fonts = {
  pretendard: '"Pretendard", sans-serif',
  oneShinhan: '"OneShinhan", sans-serif',
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

// Typography Styles
export const typography = {
  ctaBold18: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.bold,
    fontSize: '18px',
    lineHeight: 1.2,
  },
  headingBold20: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.bold,
    fontSize: '20px',
    lineHeight: 1.2,
  },
  headingSemiBold20: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.semiBold,
    fontSize: '20px',
    lineHeight: 1.2,
    letterSpacing: '-0.4px',
  },
  bodyRegular16: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.regular,
    fontSize: '16px',
    lineHeight: 1.2,
  },
  bodySemiBold16: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.semiBold,
    fontSize: '16px',
    lineHeight: 1.2,
    letterSpacing: '-0.64px',
  },
  bodyBold16: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.bold,
    fontSize: '16px',
    lineHeight: 1.4,
  },
  bodySemiBold14: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.semiBold,
    fontSize: '14px',
    lineHeight: 1.4,
  },
  captionRegular12: {
    fontFamily: fonts.pretendard,
    fontWeight: fontWeights.regular,
    fontSize: '12px',
    lineHeight: 1.2,
  },
  bodyLight18: {
    fontFamily: fonts.oneShinhan,
    fontWeight: fontWeights.light,
    fontSize: '18px',
    lineHeight: 1.4,
    letterSpacing: '-0.36px',
  },
  bodyMedium18: {
    fontFamily: fonts.oneShinhan,
    fontWeight: fontWeights.medium,
    fontSize: '18px',
    lineHeight: 1.4,
    letterSpacing: '-0.36px',
  },
  headingLight28: {
    fontFamily: fonts.oneShinhan,
    fontWeight: fontWeights.light,
    fontSize: '28px',
    lineHeight: 1.4,
    letterSpacing: '-0.56px',
  },
  headingMedium28: {
    fontFamily: fonts.oneShinhan,
    fontWeight: fontWeights.medium,
    fontSize: '28px',
    lineHeight: 1.4,
    letterSpacing: '-0.56px',
  },
} as const;

// Frame Size (Fixed)
export const frameSize = {
  width: 393,
  height: 852,
} as const;
