import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

// mongoose에서 Types 함수를 호출해서 ObjectId 객체를 만듦
const { ObjectId } = mongoose.Types;

// ctx와 next 함수를 받아와서 실행
export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  // ObjectId 객체의 isValid 함수를 써서 id 검증
  // id가 유효하지 않으면
  if (!ObjectId.isValid(id)) {
    // 400번 에러(Bad Request) 던지고 종료
    ctx.status = 400;
    return;
  }
  // 유효한 id이면 다음 내용 실행 (next())
  return next();
};

export const write = async (ctx) => {
  // title, body, tags 값을 모두 전달받았는지 검증
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  // 검증에 실패한 경우(값이 일부 누락된 경우) 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error; // 브라우저에 에러내용 전달
    return; // 종료
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || '1', 10);
  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean() // map으로 꺼낼 때 데이터를 처음부터 JSON 형태로 조회 - 아래에서 toJSON() 과정 없어도 됨
      .exec();
    // 포스트 개수 (만약 200개라고 하면)
    const postCount = await Post.countDocuments().exec();
    // last-page로 postCount에서 10을 나눈 값을 넣어준다 (마지막 페이지 -> 20페이지)
    ctx.set('Last-Page', Math.ceil(postCount / 10)); // (딱 안 나누어 떨어질 때를 대비해 올림 처리)

    // 브라우저에 보여줄 내용
    ctx.body = posts
      // // posts에서 map으로 하나씩 꺼내서 각 객체를 JSON 형태로 바꿔주고 반환
      // // lean()으로 생략 가능한 과정
      // .map((post) => post.toJSON())

      // JSON 형태가 된 각 객체를 수정
      .map((post) => ({
        // 해당 객체에서 body 키를 제외한 나머지 값들은 그대로 넣어주고
        ...post,
        // body만 수정 -> body 글의 길이가 200 미만이면 body 그대로 반환,
        // 아니면 0번째 글자부터 200번째 바로 앞 글자까지 잘라서 뒤에 '...' 붙여서 반환
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // 요청은 처리했으나 응답할 데이터는 없음 -> 삭제에 쓰임
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx) => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
