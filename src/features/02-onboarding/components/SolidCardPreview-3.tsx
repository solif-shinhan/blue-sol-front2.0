import { colors, fonts } from '../../../styles/tokens';
import { CardTheme } from '../types/card-1';

type CardSize = 'small' | 'medium' | 'large' | 'complete';

export const getMoreTagStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isComplete ? '33px' : isMedium ? '36px' : isLarge ? '38px' : '22px',
    height: isComplete ? '33px' : isMedium ? '36px' : isLarge ? '38px' : '22px',
    borderRadius: isComplete ? '16px' : isMedium ? '18px' : isLarge ? '19px' : '11px',
    backgroundColor: (isComplete || isMedium) ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
    boxShadow: isMedium ? '0px 0px 12px rgba(0, 0, 0, 0.05)' : '0px 0px 11px rgba(0, 0, 0, 0.05)',
  };
};

export const getDotsStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    display: 'flex',
    gap: isComplete ? '3px' : isMedium ? '4px' : isLarge ? '4px' : '2px',
  };
};

export const getDotStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    width: isComplete ? '5px' : isMedium ? '5px' : isLarge ? '6px' : '3px',
    height: isComplete ? '5px' : isMedium ? '5px' : isLarge ? '6px' : '3px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  };
};

export const getGoalsContainerStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    position: 'absolute',
    left: isComplete ? '22px' : isMedium ? '24px' : isLarge ? '29px' : '16px',
    top: isComplete ? '291px' : isMedium ? '320px' : isLarge ? '340px' : '190px',
    display: 'flex',
    flexDirection: 'column',
    gap: isComplete ? '12px' : isMedium ? '13px' : isLarge ? '14px' : '8px',
    width: isComplete ? '194px' : isMedium ? '214px' : isLarge ? '230px' : '130px',
  };
};

export const getGoalStyle = (size: CardSize, index: number, _theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 700,
    fontSize: isComplete ? '18px' : isMedium ? '20px' : isLarge ? '21px' : '12px',
    lineHeight: 1.2,
    color: colors.gray,
    letterSpacing: '-0.39px',
    opacity: index === 0 ? 0.8 : index === 1 ? 0.6 : 0.4,
    margin: 0,
    whiteSpace: 'pre-wrap',
  };
};

export const getFooterStyle = (size: CardSize): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: isComplete ? '35px' : isMedium ? '60px' : isLarge ? '25px' : '14px',
    width: isComplete ? '253px' : isMedium ? '279px' : isLarge ? '300px' : '170px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
};

export const getSchoolStyle = (size: CardSize, _theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 700,
    fontSize: isComplete ? '15px' : isMedium ? '17px' : isLarge ? '18px' : '10px',
    lineHeight: 1.2,
    color: colors.gray,
    letterSpacing: '-0.33px',
  };
};

export const getSinceStyle = (size: CardSize, _theme: CardTheme = 'light'): React.CSSProperties => {
  const isComplete = size === 'complete';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return {
    fontFamily: fonts.oneShinhan,
    fontWeight: 300,
    fontSize: isComplete ? '14px' : isMedium ? '15px' : isLarge ? '17px' : '9px',
    lineHeight: 1.2,
    color: colors.gray,
    letterSpacing: '-0.31px',
  };
};
