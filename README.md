
# 𝕏 X-Clone(구 트위터) 클론 코딩

트위터의 주요 기능을 구현한 클론 프로젝트입니다. Firebase를 기반으로 사용자 인증, 데이터 저장, 이미지 업로드, 실시간 트윗 기능을 지원하며, 배포까지 완료된 프로젝트입니다.

## 🚀 데모

👉 **[배포 링크](https://x-clone-d17bb.web.app)**  
🧪 테스트 계정  
- 이메일: `test@xclone.com`  
- 비밀번호: `123456`

## 🛠️ 사용 기술

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React, TypeScript, styled-components, Vite |
| 인증/DB/저장소 | Firebase Authentication, Firestore, Storage |
| 배포 | Firebase Hosting |
| 그 외 | React Router, GitHub OAuth, React Modal |

## 🧩 주요 기능

- [x] 회원가입 / 로그인 / 로그아웃 (GitHub OAuth 포함)
- [x] 트윗 작성, 삭제
- [x] 이미지 업로드 (10MB 제한)
- [x] 유저 프로필 수정 (닉네임 변경)
- [x] 실시간 트윗 타임라인 (onSnapshot)
- [x] Firebase 보안 규칙 적용
- [x] 반응형 UI (모바일 대응)
- [x] 배포 및 테스트 계정 구성

## 📁 폴더 구조

\`\`\`
src/
├── components/        # UI 컴포넌트들
├── routes/            # 페이지 컴포넌트들 (home, login 등)
├── hooks/             # 커스텀 훅 (선택)
├── firebase.ts        # Firebase 설정 파일
├── App.tsx
└── main.tsx
\`\`\`

## ⚙️ Firebase 설정

### 🔑 Firebase Auth
- **이메일/비밀번호** + **GitHub 로그인**
- `GitHub OAuth 설정 시 주의`:
  - 콜백 URL:  
    \`\`\`
    https://x-clone-d17bb.web.app/__/auth/handler
    https://x-clone-d17bb.firebaseapp.com/__/auth/handler
    \`\`\`

### 🔐 Firestore 보안 규칙

\`\`\`ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tweets/{doc} {
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
\`\`\`

### 🗂️ Storage 보안 규칙

\`\`\`ts
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
\`\`\`

# ✨ 향후 추가 예정 기능 - Twitter Clone

기본 기능을 넘어서 실전 서비스처럼 만들기 위한 기능들을 정리한 로드맵입니다.

## 🧾 사용자 기능

- [ ] 댓글 기능 (트윗에 대한 답글/대댓글)
- [ ] 좋아요 기능 (하트 누르기 및 개수 표시)
- [ ] 리트윗 기능
- [ ] 트윗 검색 (키워드/작성자 기준)
- [ ] 사용자 프로필 페이지 (작성한 트윗 모아보기)
- [ ] 팔로우/언팔로우 기능
- [ ] 팔로잉/팔로워 수 및 목록 보기
- [ ] DM 기능 (Firebase Realtime DB나 Subcollection 활용)
- [ ] 다중 이미지 첨부 및 슬라이드 보기

## 📱 UI/UX 개선

- [ ] 무한 스크롤 (스크롤 시 트윗 더 불러오기)
- [ ] 이미지 미리보기 (업로드 전 썸네일 표시)
- [ ] 트윗에 작성 시간 포맷팅 (ex: 1분 전, 1일 전)
- [ ] 로딩 스피너 및 에러 메시지 UI 개선
- [ ] 반응형 최적화 (모바일 뷰 정교화)
- [ ] 다크모드 토글

## 🛡️ 보안 및 품질

- [ ] 인증되지 않은 사용자의 접근 제한 (라우팅 보호)
- [ ] 삭제/수정 시 사용자 확인 모달
- [ ] 비속어 필터링
- [ ] Firebase 보안 규칙 강화 (트윗 수정 시 시간 조건 등)
- [ ] 트윗 작성 시 속도 제한 (rate limiting)

## 🚀 배포 및 유지보수

- [ ] Sentry 등 에러 추적 도구 연동
- [ ] Lighthouse로 성능 점검 및 개선
- [ ] PWA 적용 (홈화면 추가 기능)
- [ ] GitHub Actions로 CI/CD 자동 배포

