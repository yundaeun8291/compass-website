# COMPASS 졸업전시 웹사이트

정적 HTML·CSS·JavaScript 사이트입니다. 빌드나 서버 API가 필요하지 않습니다.

## 공개 주소

- GitHub Pages: https://yundaeun8291.github.io/compass-website/
- 기존 사이트: https://compass-graduation-2026-daeun.dbsekdms8291.chatgpt.site/

## 파일 구조

- `dist/index.html`: 웹사이트 시작 파일
- `dist/app.js`: 섹션 탐색과 인터랙션
- `dist/revision-motion.js`: SVG 모션
- `dist/planning-player.js`: 인트로 영상 재생
- `dist/feature-videos.js`: 기능 영상 순차 재생
- `dist/assets`, `dist/images`, `dist/videos`, `dist/fonts`: 디자인 원본과 미디어

## 로컬 미리보기

Node.js가 있는 환경에서 프로젝트 폴더에서 실행합니다.

```sh
node server.mjs
```

http://localhost:4173 에서 볼 수 있습니다. 파일을 직접 열면 SVG 로딩이 제한되므로 HTTP 서버를 사용합니다.

## GitHub 및 다른 호스팅으로 배포

`.github/workflows/deploy.yml`이 `main` 브랜치 변경 시 `dist` 폴더를 GitHub Pages로 자동 배포합니다.
다른 정적 호스팅으로 옮길 때도 `dist` 폴더의 내용 전체를 업로드하면 됩니다. 상대 경로를 사용해 하위 경로 배포를 지원합니다.

인트로는 소리를 켠 자동재생을 시도합니다. 브라우저가 이를 차단하는 경우 영상 영역 또는 하단 재생 버튼을 눌러 시작할 수 있습니다.

