# lib-check

[English](./README.md)

NPM 라이브러리의 버전을 쉽게 추적하고 확인할 수 있는 커맨드라인 도구입니다.

## 주요 기능

- 사용자별 NPM 라이브러리 관리
- NPM 패키지 자동완성 검색
- 라이브러리 최신 버전 확인
- 마지막 업데이트 날짜 확인
- 라이브러리 설명 확인
- 간단하고 직관적인 명령어

## 설치 방법

```bash
npm install -g @jiji-hoon96/lib-check
```

## 사용 방법

### 사용자 ID 설정
처음 명령어를 실행할 때 사용자 ID를 입력하라는 메시지가 표시됩니다. 이 ID는 사용자별로 다른 라이브러리 목록을 관리하는 데 사용됩니다.

### 도움말 보기
```bash
lib-check --help
```

### 라이브러리 추가
```bash
lib-check add

# 자동완성 검색이 시작됩니다
# 최소 3글자 이상 입력하면 패키지 검색이 시작됩니다
```

### 관리 중인 라이브러리 목록 보기
```bash
lib-check list
```

### 라이브러리 정보 확인
```bash
lib-check check
```
각 라이브러리에 대해 다음 정보를 보여줍니다:
- 현재 버전
- 마지막 업데이트 날짜
- 라이브러리 설명
- 홈페이지 (있는 경우)

### 라이브러리 제거
```bash
lib-check remove

# 대화형 선택 메뉴가 나타납니다
```

### 설정 관리
```bash
# 현재 설정 보기
lib-check config --show

# 사용자 ID 변경
lib-check config --change

# 모든 설정 초기화
lib-check config --reset
```

## npx로 사용하기

전역 설치 없이 다음과 같이 사용할 수도 있습니다:

```bash
npx @jiji-hoon96/lib-check --help
npx @jiji-hoon96/lib-check add
npx @jiji-hoon96/lib-check list
npx @jiji-hoon96/lib-check check
```

## 사용 예시

```bash
$ lib-check add
? 패키지 검색: react
react가 감시 목록에 추가되었습니다

$ lib-check list
사용자 "your-user-id"의 감시 중인 라이브러리:
- react

$ lib-check check
라이브러리 정보를 가져오는 중...

react:
  현재 버전: 18.2.0
  마지막 업데이트: 2023-06-14
  설명: React는 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.
  홈페이지: https://reactjs.org
```

## lib-check를 사용해야 하는 이유

- **사용자별 목록**: 각 사용자가 자신만의 라이브러리 목록을 관리할 수 있습니다
- **쉬운 검색**: 자동완성 검색으로 패키지를 쉽게 찾을 수 있습니다
- **업데이트 확인**: 자주 사용하는 라이브러리의 업데이트를 빠르게 확인할 수 있습니다
- **효율적**: 중요한 정보를 한 곳에서 확인할 수 있습니다
- **간단한 인터페이스**: 직관적인 명령어로 쉽게 사용할 수 있습니다

## 기여하기

버그를 발견하셨거나 새로운 기능을 제안하고 싶으시다면 GitHub에 이슈를 생성해 주세요.

## 라이선스

MIT

## 제작자

jiji-hoon96