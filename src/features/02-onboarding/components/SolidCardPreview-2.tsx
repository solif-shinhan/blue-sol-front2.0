import { colors, fonts, fontWeights } from '../../../styles/tokens';
import { CardTheme } from '../types/card-1';

type CardSize = 'small' | 'medium' | 'large' | 'complete';

interface Dimensions {
  width: number;
  height: number;
  topHeight: number;
}

export const cardDimensions: Record<CardSize, Dimensions> = {
  large: { width: 350, height: 583, topHeight: 294 },
  complete: { width: 300, height: 478, topHeight: 259 },
  medium: { width: 330, height: 526, topHeight: 285 },
  small: { width: 200, height: 330, topHeight: 166 },
};

export const getCardStyle = (
  size: CardSize,
  hasOnClick: boolean
): React.CSSProperties => {
  const { width, height } = cardDimensions[size];
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: isComplete ? '28px' : isMedium ? '30px' : isLarge ? '32px' : '18px',
    backgroundColor: colors.white,
    position: 'relative',
    overflow: 'hidden',
    cursor: hasOnClick ? 'pointer' : 'default',
    boxShadow: `0px 0px ${isComplete ? 30 : isMedium ? 30 : 32}px rgba(27, 37, 56, ${isMedium ? 0.2 : 0.1})`,
  };
};

export const getTopSectionStyle = (
  size: CardSize,
  gradientStart: string,
  gradientEnd: string
): React.CSSProperties => {
  const { topHeight } = cardDimensions[size];
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';

  return {
    position: 'absolute',
    top: isComplete ? '-1px' : isMedium ? '-1px' : 0,
    left: isComplete ? '-8px' : isMedium ? '-8px' : 0,
    width: isComplete ? '318px' : isMedium ? '350px' : '100%',
    height: `${topHeight}px`,
    background: `linear-gradient(180deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
  };
};

export const getLogoStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    position: 'absolute',
    top: isComplete ? '24px' : isMedium ? '27px' : isLarge ? '31px' : '18px',
    left: isComplete ? '25px' : isMedium ? '27px' : isLarge ? '33px' : '19px',
    fontFamily: fonts.oneShinhan,
    fontSize: isComplete ? '14px' : isMedium ? '14px' : isLarge ? '19px' : '11px',
    fontWeight: fontWeights.light,
    color: theme === 'light' ? colors.blueDefault : colors.white,
    letterSpacing: '-0.27px',
    lineHeight: 1.2,
  };
};

export const getUserInfoStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    position: 'absolute',
    top: isComplete ? '77px' : isMedium ? '85px' : isLarge ? '90px' : '51px',
    left: isComplete ? '22px' : isMedium ? '24px' : isLarge ? '29px' : '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: isComplete ? '15px' : isMedium ? '16px' : isLarge ? '17px' : '10px',
  };
};

export const getNameStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 700,
    fontSize: isComplete ? '38px' : isMedium ? '42px' : isLarge ? '45px' : '25px',
    lineHeight: 1,
    color: theme === 'light' ? '#14307C' : colors.white,
    margin: 0,
  };
};

export const getRoleStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 400,
    fontSize: isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    lineHeight: 1.2,
    color: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)',
    letterSpacing: '-0.65px',
  };
};

export const getCharacterStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    position: 'absolute',
    right: isComplete ? '14px' : isMedium ? '16px' : isLarge ? '23px' : '13px',
    top: isComplete ? '51px' : isMedium ? '56px' : isLarge ? '42px' : '24px',
    width: isComplete ? '147px' : isMedium ? '162px' : isLarge ? '172px' : '97px',
    height: isComplete ? '143px' : isMedium ? '157px' : isLarge ? '167px' : '94px',
    objectFit: 'contain',
  };
};

export const getTagsContainerStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    position: 'absolute',
    left: isComplete ? '16px' : isMedium ? '17px' : isLarge ? '18px' : '10px',
    top: isComplete ? '208px' : isMedium ? '229px' : isLarge ? '235px' : '133px',
    display: 'flex',
    gap: isComplete ? '7px' : isMedium ? '8px' : isLarge ? '8px' : '5px',
    alignItems: 'center',
  };
};

export const getTagStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    display: 'flex',
    alignItems: 'center',
    gap: isComplete ? '5px' : isMedium ? '5px' : isLarge ? '6px' : '3px',
    height: isComplete ? '33px' : isMedium ? '36px' : isLarge ? '38px' : '22px',
    paddingLeft: isComplete ? '6px' : isMedium ? '6px' : isLarge ? '7px' : '4px',
    paddingRight: isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    borderRadius: isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    backgroundColor: (isComplete || isMedium) ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.05)',
  };
};

export const getTagIconStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    width: isComplete ? '25px' : isMedium ? '27px' : isLarge ? '29px' : '16px',
    height: isComplete ? '25px' : isMedium ? '27px' : isLarge ? '29px' : '16px',
    borderRadius: '50%',
    overflow: 'hidden',
  };
};

export const getTagTextStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 600,
    fontSize: isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    lineHeight: 1.2,
    color: theme === 'light' ? colors.gray : colors.white,
    letterSpacing: '-0.36px',
  };
};
