# my_books

프리티어 setting.json으로 사용
app.module에서 gql, typeorm, config 모듈 사용
main.ts에서 파이프, 익셉션필터, 파일업로드 사용

설치한 패키지들: graphql, apollo-server @nestjs/config nestjs/typeorm typeorm mysql2 class-validator class-transformers @nestjs/microservices
passport passport-jwt passport-google-oauth20 passport-naver-v2 passport-kakao
@google-cloud/storage graphql-upload @types/graphql-upload
nodemailer
axios
crypto(내장) : 구글로그인 난수비밀번호 생성

그 외 설정해준 부분들: .env.docker, 도커야믈파일 경로설정,

////////
@@@@@@체크할 내용들@@@@@@@
////////

프로덕트 삭제수정할때 이미지파일도 같이삭제수정하기
오더 트랜스액션 적용하기, 오더랑 페이먼트트랜즈액션 연결하기
리뷰 엔티티에 아이디넣기.
리뷰 아이디 있어야 작성할수있게 해서 로그인요구하고
내가 작성한 리뷰 찾기 뭐 이런것도 나중에해보기

마지막 테스트할시 프론트의 payment.html에서 axios 쿼리날릴때 주소 수정해주기

// 추후에 해결할 내용들

에러코드 잘설정해주자.. 그냥 httpexception으로 퉁치는게 안전하지만 지금 적용할 필요는 없어보임.
나중에 배포코드에서는 분리해도 좋을듯.

페이먼트서비스 부분에서 포인트 환불부분 로직생각해보기 << 포인트를 2주뒤에 적립하게해서, 아직 구현이 어렵다. 포인트 환불로직만 구현했음.

앞으로 함수하나당 파일 하나로 분리하기..? 추후에..

레디스사용한다면 상품인기순을 레디스로측정하면좋을듯.

마지막에, 관리자권한주고 관리자역할부여하기 추가

// 고민하고 해결한 내용들

softDelete 언제 적용할지 고민해봤음.. 거래내역에만 하는게 좋을듯하여 상품 삭제에서는 적용하지않음. (완료. 추가로 결제API 삭제에다가 적용)
페이먼트 트랜스액션 적용하기
프로덕트 중복 거를방법 생각해봤는데, 책은 ISBN으로 중복처리하고, 상품은 중복 안하고 대신 브랜드명을 넣는 것으로 사용하려함.
