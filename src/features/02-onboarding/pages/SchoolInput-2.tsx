import React from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';

export const getSchoolInputStyles = (
  region: string,
  showRegionDropdown: boolean
) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '70px',
    left: 0,
  };

  const titleContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '144px',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    fontSize: '26px',
    lineHeight: 1.5,
    color: colors.dark,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.bodySemiBold14,
    color: '#3971E0',
    marginTop: '12px',
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '17px',
    top: '270px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    color: colors.gray,
    marginBottom: '8px',
  };

  const regionSelectorStyle: React.CSSProperties = {
    position: 'relative',
    width: '360px',
  };

  const regionButtonStyle: React.CSSProperties = {
    width: '360px',
    height: '60px',
    borderRadius: '24px',
    border: `1px solid ${colors.lightGray2}`,
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    cursor: 'pointer',
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 500,
    fontSize: '18px',
    color: region ? colors.dark : colors.lightGray3,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '64px',
    left: 0,
    width: '360px',
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightGray2}`,
    borderRadius: '16px',
    zIndex: 100,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 500,
    fontSize: '16px',
    color: colors.dark,
    cursor: 'pointer',
    borderBottom: `1px solid ${colors.lightGray2}`,
  };

  const arrowStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRight: `2px solid ${colors.gray}`,
    borderBottom: `2px solid ${colors.gray}`,
    transform: showRegionDropdown ? 'rotate(-135deg)' : 'rotate(45deg)',
    transition: 'transform 0.2s',
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    bottom: '60px',
    width: '360px',
  };

  return {
    containerStyle,
    headerStyle,
    titleContainerStyle,
    titleStyle,
    subtitleStyle,
    inputContainerStyle,
    labelStyle,
    regionSelectorStyle,
    regionButtonStyle,
    dropdownStyle,
    dropdownItemStyle,
    arrowStyle,
    buttonContainerStyle,
  };
};

export const regions = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];
