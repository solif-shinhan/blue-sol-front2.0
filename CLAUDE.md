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

---

## Figma MCP 연동 규칙 (필수)

### 1. 디자인 일치 원칙
- **Figma에 기획된 디자인과 100% 일치**하게 구현해야 합니다.
- 색상, 폰트, 간격, 크기 등 모든 스타일을 Figma 그대로 적용합니다.
- 임의로 디자인을 변경하거나 추측하지 않습니다.

### 2. Figma Auto Layout 변환 규칙 (중요)

Figma의 Auto Layout을 CSS Flexbox로 변환할 때 아래 규칙을 따릅니다:

#### 간격(Gap) 변환표
| Figma 표기 | CSS 변환 | 설명 |
|------------|----------|------|
| `Auto` | `justify-content: space-between` | 남는 공간을 아이템 사이에 균등 배분 |
| `숫자 (예: 16)` | `gap: 16px` | 고정 간격 |

#### 정렬 변환표
| Figma 표기 | CSS 변환 |
|------------|----------|
| Packed (Start) | `justify-content: flex-start` |
| Packed (Center) | `justify-content: center` |
| Packed (End) | `justify-content: flex-end` |
| Space between | `justify-content: space-between` |

#### 구현 예시
```tsx
// Figma: Auto Layout (Horizontal, Gap: Auto)
<div style={{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',  // Gap이 'Auto'일 때
  alignItems: 'center'
}}>
  <LeftItem />
  <RightItem />
</div>

// Figma: Auto Layout (Vertical, Gap: 16)
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'  // Gap이 숫자일 때
}}>
  <Item1 />
  <Item2 />
</div>
```

#### 주의사항
- **'Auto' 간격을 px 수치로 계산하지 마세요** - 그냥 `space-between` 사용
- Figma MCP에서 가져온 데이터에 `itemSpacing: "AUTO"` 또는 유사 표현이 있으면 `space-between` 적용
- 스크린샷/이미지에서 아이템들이 양 끝에 붙어있고 중간이 비어있으면 `space-between`

### 3. 아이콘 및 이미지 규칙
- Figma에 기획된 아이콘이나 이미지가 필요할 때는 **반드시 사용자에게 먼저 질문**합니다.
- 질문 예시:
  - "이 아이콘은 Figma에서 가져와야 할까요? 아이콘 이름이나 위치를 알려주세요."
  - "이 이미지 에셋이 필요합니다. Figma에서 export 해주시거나 경로를 알려주세요."
- 사용자 확인 없이 임의로 아이콘/이미지를 대체하지 않습니다.

### 4. 프레임 크기 (고정)
```
Width: 393px
Height: 852px
```
- **모든 페이지**는 위 크기를 기준으로 고정합니다.
- 반응형이 아닌 고정 레이아웃입니다.
- 이 규격을 벗어나는 구현은 하지 않습니다.

---

## 페이지 검증 규칙 (필수)

### 작업 전 확인사항
코드를 수정하기 전에 해당 페이지가 아래 조건을 만족하는지 확인합니다:

1. **프레임 크기**: W393px / H852px 고정인가?
2. **Figma 일치**: 디자인이 Figma와 일치하는가?

### 불일치 발견 시 행동
기존 페이지가 위 규격에 맞지 않는 경우:
- **수정하기 전에 반드시 사용자에게 질문**합니다.
- 질문 예시:
  - "이 페이지의 너비가 393px가 아닌 것 같습니다. 393px로 수정할까요?"
  - "이 컴포넌트가 Figma 디자인과 다른 것 같습니다. 수정이 필요할까요?"
- 사용자 승인 후에만 수정을 진행합니다.

---

## 코딩 규칙

### 파일 크기 제한 (400줄 규칙)
- **파일당 최대 400줄**을 초과하지 않습니다.
- 400줄을 초과할 경우 아래 규칙에 따라 분리합니다.

#### 파일 분리 명명 규칙
| 파일 유형 | 분리 전 | 분리 후 |
|-----------|---------|---------|
| CSS 모듈 | `Component.module.css` | `Component-1.module.css`, `Component-2.module.css`, ... `Component-n.module.css` |
| TSX 컴포넌트 | `Component.tsx` | `Component-1.tsx`, `Component-2.tsx`, ... `Component-n.tsx` |
| 일반 파일 | `FileName.ext` | `FileName-1.ext`, `FileName-2.ext`, ... `FileName-n.ext` |

#### 분리 기준
1. **논리적 단위**로 분리 (섹션별, 기능별)
2. **의존성 순서** 유지 (-1이 기본, -2, -3, ... -n이 확장)
3. **import 정리**: 메인 파일에서 분리된 파일들을 import

#### 분리 예시 (CSS)
```css
/* Component-1.module.css - 기본 레이아웃 */
.container { ... }
.header { ... }

/* Component-2.module.css - 카드, 리스트 등 */
.card { ... }
.list { ... }

/* Component-3.module.css - 추가 섹션 */
.section { ... }
.footer { ... }
```

```tsx
// Component.tsx에서 import
import styles1 from './Component-1.module.css'
import styles2 from './Component-2.module.css'
import styles3 from './Component-3.module.css'

// 사용 시
<div className={styles1.container}>
  <div className={styles2.card}>...</div>
  <div className={styles3.section}>...</div>
</div>
```

#### 리팩토링 시 필수 확인
- 분리 전후 **디자인 변화 없음** 확인
- 모든 클래스/함수가 **정상 동작** 확인
- 사용되지 않는 코드는 **삭제** (Legacy 코드 정리)

### 스타일링
- 인라인 스타일 또는 CSS 모듈 사용
- px 단위 사용 (Figma와 일치)
- 색상값은 Figma에서 정확히 복사

### 컴포넌트 구조
```tsx
// 페이지 컴포넌트 기본 구조
const PageName = () => {
  return (
    <div style={{
      width: '393px',
      height: '852px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 컨텐츠 */}
    </div>
  );
};
```

---

## 질문해야 하는 상황 (필수)

다음 상황에서는 **반드시 사용자에게 질문**합니다:

| 상황 | 질문 예시 |
|------|-----------|
| 아이콘 필요 | "이 아이콘의 Figma 에셋을 알려주세요" |
| 이미지 필요 | "이 이미지 파일 경로를 알려주세요" |
| 프레임 크기 불일치 | "393x852로 수정할까요?" |
| 디자인 불명확 | "Figma에서 이 부분 디자인을 확인해주세요" |
| 기존 코드가 규격 미준수 | "이 페이지가 규격에 맞지 않습니다. 수정할까요?" |

---

## 금지사항

- Figma 확인 없이 임의로 디자인 결정하기
- 393x852 외의 다른 크기로 페이지 만들기
- 아이콘/이미지를 임의로 대체하기
- 사용자 확인 없이 기존 페이지 규격 수정하기
