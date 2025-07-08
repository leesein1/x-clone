# 𝕏 X-Clone (구 트위터 클론 프로젝트)

트위터의 핵심 기능을 직접 구현한 SNS 클론 프로젝트입니다.  
Firebase를 기반으로 사용자 인증, 트윗 작성/삭제, 이미지 업로드, 실시간 타임라인 등  
**실제 서비스에 준하는 구조와 기능을 구현**하였고, Firebase Hosting을 통해 배포까지 완료했습니다.

---

## 🧑‍💻 개발 목적

📌 기존에 주로 C#과 .NET 기반의 웹 개발을 해왔지만,  
**현업에서 널리 쓰이는 React와 TypeScript**같은 프론트엔디 기술의 흥미를 느껴  
이를 실습하고 익히기 위한 목적으로 이 프로젝트를 시작하게 되었습니다.

프로젝트 초반에는 **노마드코더의 트위터 클론 강의**를 참고하여  
React 구조와 Firebase 환경 구성의 기초를 학습했고,  
이후에는 기능들을 **직접 설계하고 구현하며 확장해 나가는 중**입니다.

현재는 댓글, 좋아요, 검색, 무한 스크롤 등  
**실제 X사이트의 기능과 UX의 구현을 목표로 계속 개발 중**인 개인 사이드 프로젝트입니다.


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

---

## 📁 주요 기능 기반 폴더 구조

```
src/
├── App.tsx                       # 앱의 루트 컴포넌트, 라우터 및 전체 구조 정의
├── firebase.ts                   # Firebase 초기화 및 설정 파일
├── main.tsx                      # React 앱 진입점 (root DOM 렌더링)
├── vite-env.d.ts                 # Vite 환경 타입 선언
│
├── components/                      # 재사용 가능한 UI 및 기능 컴포넌트
│   ├── auth-components.ts           # 로그인/회원가입 관련 공통 컴포넌트
│   ├── edit.modal.tsx               # 닉네임 변경 모달 컴포넌트
│   ├── edit-modal-profilename.tsx   # 프로필 이름 수정 전용 모달 컴포넌트
│   ├── github-btn.tsx               # GitHub 로그인 버튼 컴포넌트
│   ├── layout.tsx                   # 전체 페이지 레이아웃 (Outlet 포함) 컴포넌트
│   ├── loading-screen.tsx           # 로딩 상태일 때 표시될 화면 컴포넌트
│   ├── modal-components.tsx         # 삭제 확인 등 일반 모달 컴포넌트
│   ├── post-tweet-form.tsx          # 트윗 작성 폼 컴포넌트
│   ├── protected-route.tsx          # 비 로그인 회원 식별 및 로그인 화면 포위딩
│   ├── timeline.tsx                 # 트윗 타임라인 현시 컴포넌트
│   └── tweet.tsx                    # 개별 트윗 렌더링 컴포넌트
│
└── routes/                          # 페이지별 라우팅 컴포넌트
    ├── create-account.tsx           # 회원가입 페이지 컴포넌트
    ├── home.tsx                     # 메인 타임라인 페이지 컴포넌트
    ├── login.tsx                    # 로그인 페이지 컴포넌트
    └── profile.tsx                  # 사용자 프로필 페이지 컴포넌트
```

## ⚙️ Firebase 설정

### 🔑 Firebase Auth
- **이메일/비밀번호** + **GitHub 로그인**
- `GitHub OAuth 설정 시 주의`:
  - 콜백 URL:  
    ```
    https://x-clone-d17bb.web.app/__/auth/handler
    https://x-clone-d17bb.firebaseapp.com/__/auth/handler
    ```

### 🔐 Firestore 보안 규칙

```ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tweets/{doc} {
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 🗂️ Storage 보안 규칙

```ts
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

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

