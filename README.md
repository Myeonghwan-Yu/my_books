# my_books

프리티어 setting.json으로 사용

설치한\패키지들: graphql, apollo-server @nestjs/config nestjs/typeorm typeorm mysql2 class-validator class-transformers
jwt passport-jwt passport

체크할 내용들 :
중복검사 할 때 이름으로 조건을 걸면 안 됨.중복되는 상품 이름이 많아서 불가능함.
어떻게 할지 고민..

softDelete 언제 적용할지 고민해봤음.. 거래내역에만 하는게 좋을듯하여 상품 삭제에서는 적용하지않음.

product 삭제부분 이상함.. 항상 false 나오는데 원인 파악해봐야곘음.

북프로덕트 부분 인터페이스도 만들어줘야할듯..

에러코드 잘설정해주자.. 그냥 httpexception으로 퉁치는게 안전

어싱크어웨잇 안적용한곳있는지 확인하기

조건 잘챙기기

해시도 서비스에서 분리해서 사용하기

배포할 때 에러코드는 알수없게 서버 에러로 퉁쳐버리기

ENV에 스트레티지 비밀번호 빼기

앞으로 함수하나당 파일 하나로 분리하기? 이건아직어렵나

레디스사용한다면 상품인기순을 레디스로측정하면좋을듯..

북프로덕트에서 수정 조회 부분은 아직안만듦..
