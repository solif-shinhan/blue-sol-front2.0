# Fonts

## 설치된 폰트 ✅

### 1. One신한 (Shinhan Primary Font)
- 헤딩, 타이틀에 사용
- **OneShinhanLight.otf** - Light (300)
- **OneShinhanMedium.otf** - Medium (500)

### 2. Pretendard
- 본문 텍스트에 사용
- **Pretendard-Regular.otf** - Regular (400)
- **Pretendard-Medium.otf** - Medium (500)
- **Pretendard-SemiBold.otf** - SemiBold (600)
- **Pretendard-Bold.otf** - Bold (700)

---

## 폰트 파일 구조

```
fonts/
├── OneShinhanLight.otf
├── OneShinhanMedium.otf
├── Pretendard-Regular.otf
├── Pretendard-Medium.otf
├── Pretendard-SemiBold.otf
├── Pretendard-Bold.otf
└── README.md
```

## CSS 사용 예시

```css
@font-face {
  font-family: 'OneShinhan';
  src: url('./assets/fonts/OneShinhanMedium.otf') format('opentype');
  font-weight: 500;
}

@font-face {
  font-family: 'Pretendard';
  src: url('./assets/fonts/Pretendard-Regular.otf') format('opentype');
  font-weight: 400;
}
```

## 사용법

폰트 파일을 넣은 후, `src/styles/fonts.css`에서 @font-face를 설정하세요.
