import { colors, typography, frameSize } from '../../../styles/tokens';

export const getContainerStyle = (): React.CSSProperties => ({
  position: 'relative',
  width: `${frameSize.width}px`,
  minHeight: `${frameSize.height}px`,
  backgroundColor: colors.white,
  overflow: 'visible',
});

export const headerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '70px',
  left: 0,
};

export const titleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '150px',
  left: '16px',
};

export const titleMediumStyle: React.CSSProperties = {
  ...typography.headingMedium28,
  color: colors.dark,
};

export const titleLightStyle: React.CSSProperties = {
  ...typography.headingLight28,
  color: colors.dark,
};

export const formContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '278px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '50px',
  width: '360px',
  zIndex: 10,
};

export const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

export const buttonContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '80px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1,
};

export const footerStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: '795px',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
};

export const footerLogoStyle: React.CSSProperties = {
  width: '22px',
  height: '22px',
  objectFit: 'cover',
};

export const footerTextStyle: React.CSSProperties = {
  width: '79px',
  height: '13px',
};
