import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 스키마 생성
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 해쉬 비밀번호 만들기
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

// 해쉬 비밀번호 검증
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true/false
};

// 스태틱 메서드 (findByUsername: username으로 데이터를 찾음)
// (여기서 this는 User)
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// 토큰 발급
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return token;
};

// hashedPassword 역할: 비밀번호를 검증 후 DB에 저장하는 과정을 안전하게
// 응답할 데이터에서 역할을 완수한 hashedPassword 필드를 제거
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

const User = mongoose.model('User', UserSchema);
export default User;
