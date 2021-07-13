### client, server 통신하는 법
- Body-parser 를 이용해서 client 에서 보내주는 데이터를 받을 수 있다. 
- postman 설치 후, run -> postman 에서 post 통신

### Nodemon
- 코드의 변경사항을 바로 적용할 수 있도록 처리
- 시작할 때 nodemon 으로 시작하기 위해 script 하나를 추가
    + "backend": "nodemon index.js"
    + 서버 시작 방법 : npm run backend

### 비밀 설정 정보 관리
- development 모드 : local 환경에서는 dev.js 에 넣어서 여기서 가져오도록 한다. 
- production 모드 : deploy 환경에서는 heroku 와 같은 cloud 서비스를 이용 시 배포 후에는 여기서 가져오도록 한다.