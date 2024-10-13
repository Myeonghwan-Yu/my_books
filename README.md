# my_books

프리티어 setting.json으로 사용

설치한\패키지들: graphql, apollo-server @nestjs/config nestjs/typeorm typeorm mysql2 class-validator class-transformers
jwt passport-jwt passport
@google-cloud/storage graphql-upload @types/graphql-upload
에러미들웨어

체크할 내용들 :
중복검사 할 때 이름으로 조건을 걸면 안 됨.중복되는 상품 이름이 많아서 불가능함.
어떻게 할지 고민..

softDelete 언제 적용할지 고민해봤음.. 거래내역에만 하는게 좋을듯하여 상품 삭제에서는 적용하지않음.

product 삭제부분 이상함.. 항상 false 나오는데 원인 파악해봐야곘음.

에러코드 잘설정해주자.. 그냥 httpexception으로 퉁치는게 안전

해시도 서비스에서 분리해서 사용하기

ENV에 스트레티지 비밀번호 빼기

앞으로 함수하나당 파일 하나로 분리하기? 이건아직어렵나

레디스사용한다면 상품인기순을 레디스로측정하면좋을듯..

엔티티에서 onDelete같은 속성 적용하는것과, 코드에서 삭제부분 적용하는거 둘중하나만 사용해야함

로그인 가드 제대로걸자!

카트아이템도 안되어있네 ..ㅠㅠ
아직 모자란부분 카트, 오더, 유저조회, 로그인API부분, 파일업로드
마지막에, 관리자권한주고 관리자역할부여하기 추가

리뷰 아이디 있어야 작성할수있게하기
내가 작성한 리뷰 찾기 뭐 이런것도 나중에해보자

로그인 배포환경에서는 https설정필요
