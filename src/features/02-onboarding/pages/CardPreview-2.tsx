import React from 'react';
import { colors, typography } from '../../../styles/tokens';

export type EditTarget = 'interests' | 'nickname' | 'goals' | 'character' | 'color';

interface EditModalProps {
  onClose: () => void;
  onSelectOption: (target: EditTarget) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ onClose, onSelectOption }) => {
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    width: '393px',
    backgroundColor: colors.white,
    borderRadius: '24px 24px 0 0',
    padding: '24px 16px 40px',
  };

  const modalTitleStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    color: colors.dark,
    marginBottom: '20px',
    textAlign: 'center',
  };

  const editOptionStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    backgroundColor: colors.bgWhiteGray,
    border: 'none',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    ...typography.bodySemiBold16,
    color: colors.dark,
    textAlign: 'left',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>수정할 항목을 선택하세요</h2>
        <button style={editOptionStyle} onClick={() => onSelectOption('interests')}>
          관심사 수정
        </button>
        <button style={editOptionStyle} onClick={() => onSelectOption('nickname')}>
          닉네임 수정
        </button>
        <button style={editOptionStyle} onClick={() => onSelectOption('goals')}>
          목표 수정
        </button>
        <button style={editOptionStyle} onClick={() => onSelectOption('character')}>
          캐릭터 수정
        </button>
        <button style={editOptionStyle} onClick={() => onSelectOption('color')}>
          배경색 수정
        </button>
      </div>
    </div>
  );
};

export const cardPreviewStyles = {
  getContainerStyle: (width: number, height: number): React.CSSProperties => ({
    position: 'relative',
    width: `${width}px`,
    minHeight: `${height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  }),

  backButtonStyle: {
    position: 'absolute',
    top: '70px',
    left: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
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

  cardContainerStyle: {
    position: 'absolute',
    left: '50%',
    top: '280px',
    transform: 'translateX(-50%)',
  } as React.CSSProperties,

  infoContainerStyle: {
    position: 'absolute',
    left: '16px',
    top: '500px',
    width: '360px',
  } as React.CSSProperties,

  infoItemStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.lightGray2}`,
  } as React.CSSProperties,

  infoLabelStyle: {
    ...typography.bodySemiBold14,
    color: colors.gray,
  } as React.CSSProperties,

  infoValueStyle: {
    ...typography.bodySemiBold14,
    color: colors.dark,
    textAlign: 'right',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,

  buttonContainerStyle: {
    position: 'absolute',
    left: '16px',
    bottom: '60px',
    width: '360px',
  } as React.CSSProperties,
};

export default EditModal;
