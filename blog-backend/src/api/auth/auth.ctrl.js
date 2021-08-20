import Joi from 'joi';
import User from '../../models/user';

// 회원가입
export const register = async (ctx) => {
  // Joi: 특정 필드가 필수 항목인지 여부 + 특정 필드의 타입 및 요구사항 지정하는 라이브러리
  const schema = Joi.object().keys({
    // username: string 타입 + 숫자와 문자로만 + 3자 이상 20자 이하 + 필수 항목
    username: Joi.string().alphanum().min(3).max(20).required(),
    // password: string 타입 + 필수 항목
    password: Joi.string().required(),
  });

  // schema 객체에 요청 바디(ctx.request.body)를 넣어 유효성 검증
  const result = schema.validate(ctx.request.body);

  // 유효성 검증이 실패하면
  if (result.error) {
    ctx.status = 400; // Bad request 반환
    ctx.body = result.error; // 요청 body에 에러 내용 실어 보냄
    return; // 종료
  }

  // 유효성 검증에 성공하면 다음을 실행
  const { username, password } = ctx.request.body;

  try {
    // (최종 검증) username이 기존에 이미 있는지 확인 (=> 중복계정 생성 방지)
    const exists = await User.findByUsername(username); // boolean 반환
    if (exists) {
      ctx.status = 409; // Conflict (기존에 이미 있던 username과 충돌)
      return;
    }

    // User 모델에 위 과정을 모두 통과한 username을 넣어서 user 객체 생성
    const user = new User({
      username,
    });

    // 해당 user 객체에 검증된 비밀번호를 넣어 해당 user의 비밀번호로 설정
    await user.setPassword(password);
    // username과 password 셋팅이 끝난 user 객체를 DB에 저장(=> save() 메서드)
    await user.save();

    // 응답 바디에 data 넣어주기
    ctx.body = user.serialize();

    // catch - 에러 시 실행할 내용
  } catch (e) {
    // 500번 에러와 에러 내용 띄우기
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {};

export const check = async (ctx) => {};

export const logout = async (ctx) => {};
