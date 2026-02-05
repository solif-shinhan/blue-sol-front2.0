import { createContext, useContext, useState, ReactNode } from 'react';
import { CategoryType } from '../../../assets/icons';

export type EditTarget = 'interests' | 'nickname' | 'goals' | 'character' | 'color';

interface OnboardingData {
  interests: CategoryType[];
  nickname: string;
  goals: string[];
  characterId: string | null;
  colorId: string | null;
}

interface OnboardingContextType {
  data: OnboardingData;
  editMode: boolean;
  setInterests: (interests: CategoryType[]) => void;
  setNickname: (nickname: string) => void;
  setGoals: (goals: string[]) => void;
  setCharacterId: (id: string) => void;
  setColorId: (id: string) => void;
  setEditMode: (mode: boolean) => void;
  resetData: () => void;
}

const initialData: OnboardingData = {
  interests: [],
  nickname: '',
  goals: [],
  characterId: null,
  colorId: null,
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(initialData);
  const [editMode, setEditMode] = useState(false);

  const setInterests = (interests: CategoryType[]) => {
    setData((prev) => ({ ...prev, interests }));
  };

  const setNickname = (nickname: string) => {
    setData((prev) => ({ ...prev, nickname }));
  };

  const setGoals = (goals: string[]) => {
    setData((prev) => ({ ...prev, goals }));
  };

  const setCharacterId = (characterId: string) => {
    setData((prev) => ({ ...prev, characterId }));
  };

  const setColorId = (colorId: string) => {
    setData((prev) => ({ ...prev, colorId }));
  };

  const resetData = () => {
    setData(initialData);
    setEditMode(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        editMode,
        setInterests,
        setNickname,
        setGoals,
        setCharacterId,
        setColorId,
        setEditMode,
        resetData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
};
