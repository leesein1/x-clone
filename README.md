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

## 📁 주요 기능 기반 폴더 구조 ( 작업 중..)

```
현재 계속 추가 중

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

---

## ✨ 향후 추가 예정 기능 - Twitter Clone (Update 2025.07.10)

기본 기능을 넘어서 실전 서비스처럼 만들기 위한 기능들을 정리한 로드맵입니다.

### 사용자 기능
- [O] 팔로우 추천  
- [O] 팔로잉한 USER 트윗 보기  
- [O] @핸들 네임 추가 및 검색  
- [O] 이모지 입력 기능 (emoji-mart 연동 완료, 커서 위치 삽입 기능 적용)  
- [O] 구글 & 깃허브 소셜 로그인 연동 및 Firestore 사용자 데이터 저장  
- [O] 트윗 수정, 삭제 기능 개선 (수정 모달, 이모지 삽입 포함)  
- [O] 트윗 좋아요 기능 (Firestore 기반, 실시간 반영 및 UI 색상 처리)  
- [ ] 알림(Notifications) 기능 구현 계획  
- [ ] 실시간 메시지(채팅) 기능 계획  

### UI/UX
- [O] 추천/팔로잉 토글 UI 구현 및 상태 관리  
- [O] 트윗 Post UI 구성 및 기능 (파일 첨부, 이미지 업로드, 이모지 삽입 포함)  
- [O] UI hover 기능 및 LEFT NAV 디자인 완료  
- [O] RIGHT NAV UI (검색, 사용자 리스트, 실시간 반영)  
- [O] 이모지 픽커 자동 닫힘 기능 (클릭 아웃 감지) 구현  
- [O] 좋아요 버튼 SVG 동적 색상 처리 및 스타일 개선  
- [ ] 모바일 대응 및 반응형 UI 강화  
- [ ] 접근성(ARIA) 개선 작업 예정  

### 기술 스택 및 배포
- [O] Firebase Authentication, Firestore, Storage 연동 완료  
- [O] Vite + React 19 기반 클론코딩  
- [O] emoji-mart v1 + @emoji-mart/data 연동 및 커서 위치 삽입 기능 적용  
- [O] 좋아요 기능 Firestore 컬렉션 구조 설계 및 보안 규칙 적용  
- [ ] 배포 자동화 및 CI/CD 파이프라인 구축 예정  
- [ ] 오류 및 성능 모니터링 도구 도입 검토  
