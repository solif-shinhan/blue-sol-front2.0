import { colors, fonts, fontWeights } from '../../../styles/tokens';
import { CardTheme } from '../types/card-1';

type CardSize = 'small' | 'medium' | 'large' | 'complete' | 'preview';

interface Dimensions {
  width: number;
  height: number;
  topHeight: number;
}

export const cardDimensions: Record<CardSize, Dimensions> = {
  large: { width: 350, height: 583, topHeight: 294 },
  preview: { width: 270, height: 430, topHeight: 233 },
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
  const isPreview = size === 'preview';

  return {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: isPreview ? '25px' : isComplete ? '28px' : isMedium ? '30px' : isLarge ? '32px' : '18px',
    backgroundColor: colors.white,
    position: 'relative',
    overflow: 'hidden',
    cursor: hasOnClick ? 'pointer' : 'default',
    boxShadow: `0px 0px ${isComplete || isPreview ? 30 : isMedium ? 30 : 32}px rgba(27, 37, 56, ${isMedium ? 0.2 : 0.1})`,
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
  const isPreview = size === 'preview';

  return {
    position: 'absolute',
    top: (isComplete || isMedium || isPreview) ? '-1px' : 0,
    left: (isComplete || isMedium || isPreview) ? '-8px' : 0,
    width: isPreview ? '288px' : isComplete ? '318px' : isMedium ? '350px' : '100%',
    height: `${topHeight}px`,
    background: `linear-gradient(180deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
  };
};

export const getLogoStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    position: 'absolute',
    top: isPreview ? '22px' : isComplete ? '24px' : isMedium ? '27.11px' : isLarge ? '31px' : '18px',
    left: isPreview ? '23px' : isComplete ? '25px' : isMedium ? '27.45px' : isLarge ? '33px' : '19px',
    fontFamily: fonts.oneShinhan,
    fontSize: isPreview ? '13px' : isComplete ? '14px' : isMedium ? '14.927px' : isLarge ? '19px' : '11px',
    fontWeight: fontWeights.light,
    color: theme === 'light' ? colors.blueDefault : colors.white,
    letterSpacing: isPreview ? '-0.27px' : isComplete ? '-0.27px' : isMedium ? '-0.299px' : isLarge ? '-0.27px' : '-0.27px',
    lineHeight: '120%',
  };
};

export const getUserInfoStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    position: 'absolute',
    top: isPreview ? '69px' : isComplete ? '77px' : isMedium ? '85.19px' : isLarge ? '90px' : '51px',
    left: isPreview ? '20px' : isComplete ? '22px' : isMedium ? '23.81px' : isLarge ? '29px' : '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: isPreview ? '13px' : isComplete ? '15px' : isMedium ? '16px' : isLarge ? '17px' : '10px',
  };
};

export const getNameStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 700,
    fontSize: isPreview ? '35px' : isComplete ? '38px' : isMedium ? '42px' : isLarge ? '45px' : '25px',
    lineHeight: 1,
    color: theme === 'light' ? '#14307C' : colors.white,
    margin: 0,
  };
};

export const getRoleStyle = (size: CardSize, theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 400,
    fontSize: isPreview ? '15px' : isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    lineHeight: '120%',
    color: isMedium ? '#000' : (theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'),
    opacity: isMedium ? 0.5 : undefined,
    letterSpacing: isMedium ? '-0.72px' : '-0.65px',
  };
};

export const getCharacterStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    position: 'absolute',
    right: isPreview ? '11px' : isComplete ? '14px' : isMedium ? '16px' : isLarge ? '23px' : '13px',
    top: isPreview ? '47px' : isComplete ? '51px' : isMedium ? '56px' : isLarge ? '42px' : '24px',
    width: isPreview ? '133px' : isComplete ? '147px' : isMedium ? '162px' : isLarge ? '172px' : '97px',
    height: isPreview ? '129px' : isComplete ? '143px' : isMedium ? '157px' : isLarge ? '167px' : '94px',
    objectFit: 'contain',
  };
};

export const getTagsContainerStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    position: 'absolute',
    left: isPreview ? '14px' : isComplete ? '16px' : isMedium ? '17.36px' : isLarge ? '18px' : '10px',
    top: isPreview ? '188px' : isComplete ? '208px' : isMedium ? '228.74px' : isLarge ? '235px' : '133px',
    display: 'flex',
    gap: isPreview ? '6px' : isComplete ? '7px' : isMedium ? '8px' : isLarge ? '8px' : '5px',
    alignItems: 'center',
  };
};

export const getTagStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    display: 'flex',
    alignItems: 'center',
    gap: isPreview ? '4px' : isComplete ? '5px' : isMedium ? '5px' : isLarge ? '6px' : '3px',
    height: isPreview ? '29px' : isComplete ? '33px' : isMedium ? '36px' : isLarge ? '38px' : '22px',
    paddingLeft: isPreview ? '5px' : isComplete ? '6px' : isMedium ? '6px' : isLarge ? '7px' : '4px',
    paddingRight: isPreview ? '14px' : isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    borderRadius: isPreview ? '14px' : isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    backgroundColor: (isComplete || isMedium || isPreview) ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.05)',
  };
};

export const getTagIconStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    width: isPreview ? '22px' : isComplete ? '25px' : isMedium ? '27px' : isLarge ? '29px' : '16px',
    height: isPreview ? '22px' : isComplete ? '25px' : isMedium ? '27px' : isLarge ? '29px' : '16px',
    borderRadius: '50%',
    overflow: 'hidden',
  };
};

export const getTagTextStyle = (size: CardSize, _theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const isPreview = size === 'preview';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 600,
    fontSize: isPreview ? '14px' : isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    lineHeight: 1.2,
    color: colors.gray,
    letterSpacing: '-0.36px',
  };
};
