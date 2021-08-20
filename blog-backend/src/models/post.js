// mongoose 라이브러리에서 mongoose 모듈 임포트
import mongoose from 'mongoose';

// mongoose 모듈에서 Schema를 비구조화 할당 문법으로 꺼냄
const { Schema } = mongoose;

// 꺼낸 Schema를 이용해 새로운 스키마 객체 생성
const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 구성된 배열
  publishedDate: {
    type: Date, // type은 Date 객체이고
    default: Date.now, // 초기값은 현재 날짜
  },
});

// 생성한 Schema 객체를 이용하여 model 객체 만들기
const Post = mongoose.model('Post', PostSchema);
export default Post;
