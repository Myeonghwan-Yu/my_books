# my_books

개인 프로젝트 소개 : Nest.js와 GraphQL를 활용하여 쇼핑몰 백엔드 시스템을 구현했습니다. 상품 CRUD, JWT 토큰을 이용한 사용자 인증과 권한 관리, 장바구니, 주문 및 결제 처리까지의 기능을 포함하였으며, TypeORM을 사용하여 효율적인 데이터 관리와 API 설계를 적용했습니다. Google, Kakao, Naver 등의 OAuth2 소셜 로그인 기능도 구현하여 확장성과 편의성을 강화했습니다.

ERD 테이블 : https://www.erdcloud.com/d/XvMPeZNoEN6sXsok6

추가로 사용한 기능들:
프리티어는 setting.json으로 사용
app.module에서 gql, typeorm, config 모듈 사용
main.ts에서 파이프, 익셉션필터, 파일업로드 사용

설치한 패키지들: graphql, apollo-server @nestjs/config nestjs/typeorm typeorm mysql2 class-validator class-transformers @nestjs/microservices
passport passport-jwt passport-google-oauth20 passport-naver-v2 passport-kakao
@google-cloud/storage graphql-upload @types/graphql-upload
nodemailer axios redis cache-manager cache-manager-redis-store @types/cache-manager-redis-store @nestjs/cache-manager
crypto(내장) : 소셜로그인 난수비밀번호 생성시 사용

그 외 설정해준 부분들: .env.docker, 도커야믈파일 경로설정,

// 고민하고 해결한 내용들

softDelete 언제 적용할지 고민해봤음.. 유저, 결제API에서만 하는게 좋을듯하여 상품 삭제에서는 적용하지않음.
페이먼트부분은 트랜스액션 적용함.
프로덕트 중복 거를방법 생각해봤는데, 상품은 중복하면 안되고 대신 ISBN만 중복처리함
깃허브 커밋 쓰는법을 몰랐는데 적용하기 시작함
상품 보여줄 때 페이지네이션 구현함
프로덕트이미지 부분 고민 많이해봄. 이미지 API는 상품 API와 분리해서 따로 적용하기로함
카트에서 오더로 주문바꾸는 기능 구현함. 카트 => 오더로 바꿔주는게 필요하다는 걸 배움
레디스를 어떻게 적용해볼까 고민해봤음. 상품 조회수에 레디스이용해서 조회 많은순으로 정렬기능 구현했음.
