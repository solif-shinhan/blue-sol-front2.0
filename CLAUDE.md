# CLAUDE.md - 푸른 SOL 프로젝트 설정

## 프레임 및 스크롤 규칙 (필수)

### 1. 기본 프레임 크기
```
Width: 393px (고정)
Height: 852px (최소)
```

### 2. 스크롤 규칙
- 가로 너비는 **393px 고정**
- 세로 높이가 **852px를 넘어가면 세로 스크롤** 활성화
- **스크롤바는 숨김 처리** (scrollbar hidden)

### 3. 컨테이너 스타일 예시
```css
.container {
  width: 393px;
  min-height: 852px;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;

  /* 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
```

### 4. 적용 원칙
- 모든 페이지 컴포넌트에 위 스크롤 규칙 적용
- 콘텐츠가 852px 이내면 스크롤 없음
- 콘텐츠가 852px 초과하면 세로 스크롤 (스크롤바 숨김)
