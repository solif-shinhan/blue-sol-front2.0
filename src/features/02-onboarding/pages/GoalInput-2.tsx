import React from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';

export const goalInputStyles = {
  containerStyle: {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  } as React.CSSProperties,

  headerStyle: {
    position: 'absolute',
    top: '70px',
    left: 0,
  } as React.CSSProperties,

  titleContainerStyle: {
    position: 'absolute',
    left: '16px',
    top: '144px',
  } as React.CSSProperties,

  titleStyle: {
    ...typography.headingSemiBold20,
    fontSize: '26px',
    lineHeight: 1.5,
    color: colors.dark,
    margin: 0,
  } as React.CSSProperties,

  subtitleStyle: {
    ...typography.bodySemiBold14,
    color: '#3971E0',
    marginTop: '12px',
  } as React.CSSProperties,

  goalsContainerStyle: {
    position: 'absolute',
    left: '17px',
    top: '290px',
    width: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  } as React.CSSProperties,

  inputWrapperStyle: {
    display: 'flex',
    alignItems: 'center',
    width: '360px',
    height: '60px',
    borderRadius: '24px',
    border: `1px solid ${colors.lightGray2}`,
    backgroundColor: colors.white,
    paddingLeft: '24px',
    paddingRight: '16px',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  inputStyle: {
    flex: 1,
    border: 'none',
    outline: 'none',
    ...typography.bodySemiBold16,
    color: colors.dark,
    backgroundColor: 'transparent',
  } as React.CSSProperties,

  removeButtonStyle: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    borderRadius: '50%',
    backgroundColor: colors.white,
    border: '2px solid #3971E0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginLeft: '8px',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  addButtonContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
  } as React.CSSProperties,

  addButtonStyle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E6E6',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  } as React.CSSProperties,

  buttonContainerStyle: {
    position: 'absolute',
    left: '16px',
    bottom: '60px',
    width: '360px',
  } as React.CSSProperties,
};

export default goalInputStyles;
