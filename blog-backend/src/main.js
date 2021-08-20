require('dotenv').config(); // dotenv 라이브러리를 임포트해서 config()로 .env 파일 호출
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

// api 폴더의 라우터 import
import api from './api';
import createFakeData from './createFakeData';

// 비구조화 할당으로 process.env를 참조하는 변수 생성
const { PORT, MONGO_URI } = process.env; // .env 파일의 PORT를 받아옴

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

// api라는 경로로 라우트 사용
router.use('/api', api.routes()); //api 경로 뒤에 /test를 붙임

// router.get('/', (ctx) => {
//   ctx.body = '홈';
// });

// router.get('/about/:name?', (ctx) => {
//   const { name } = ctx.params;
//   ctx.body = name ? `${name}의 소개` : '소개';
// });

// router.get('/posts', (ctx) => {
//   const { id } = ctx.query;
//   ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
// });

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

// PORT가 설정되어 있으면 그 PORT를 쓰고
// 아니면 4000번 사용
const port = PORT || 4000; // PORT: .env 파일에 설정된 PORT

app.listen(port, () => {
  console.log('Listening to port %d', port); // port 번호는 정수니까 %d
});
