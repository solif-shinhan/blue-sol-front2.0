import React, { useState } from 'react';
import { colors } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { InputField } from '../../../components/InputField';
import { getSchoolInputStyles, regions } from './SchoolInput-2';

interface SchoolInputProps {
  onBack?: () => void;
  onNext?: (data: { region: string; school: string }) => void;
}

export const SchoolInput: React.FC<SchoolInputProps> = ({
  onBack,
  onNext,
}) => {
  const [region, setRegion] = useState('');
  const [school, setSchool] = useState('');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  const handleRegionSelect = (selectedRegion: string) => {
    setRegion(selectedRegion);
    setShowRegionDropdown(false);
  };

  const handleNext = () => {
    if (region && school.trim() && onNext) {
      onNext({ region, school: school.trim() });
    }
  };

  const isValid = region.length > 0 && school.trim().length > 0;

  const styles = getSchoolInputStyles(region, showRegionDropdown);

  return (
    <div style={styles.containerStyle}>
      <div style={styles.headerStyle}>
        <ProgressHeader totalSteps={4} currentStep={2} onBack={onBack} />
      </div>
      <div style={styles.titleContainerStyle}>
        <h1 style={styles.titleStyle}>
          학교 정보를
          <br />
          알려주세요
        </h1>
        <p style={styles.subtitleStyle}>SOLID 카드에 표시됩니다</p>
      </div>
      <div style={styles.inputContainerStyle}>
        <div>
          <p style={styles.labelStyle}>지역</p>
          <div style={styles.regionSelectorStyle}>
            <button
              type="button"
              style={styles.regionButtonStyle}
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            >
              <span>{region || '지역을 선택해주세요'}</span>
              <div style={styles.arrowStyle} />
            </button>
            {showRegionDropdown && (
              <div style={styles.dropdownStyle}>
                {regions.map((r) => (
                  <div
                    key={r}
                    style={{
                      ...styles.dropdownItemStyle,
                      backgroundColor: region === r ? colors.bgWhiteGray : colors.white,
                    }}
                    onClick={() => handleRegionSelect(r)}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <p style={styles.labelStyle}>학교명</p>
          <InputField
            placeholder="행운고등학교"
            value={school}
            onChange={setSchool}
          />
        </div>
      </div>
      <div style={styles.buttonContainerStyle}>
        <Button
          variant={isValid ? 'primary' : 'secondary'}
          disabled={!isValid}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default SchoolInput;
