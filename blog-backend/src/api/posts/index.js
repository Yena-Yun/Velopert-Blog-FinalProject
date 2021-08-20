import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

console.log(postsCtrl);

// 기존 형태: posts.메서드('경로', 파라미터(printInfo));
// postsCtrl 라우터 적용 후에는 다음과 같음
posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

export default posts;
