const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  // 로그인 시 실행, 세션에 어떤 데이터를 저장할 건지
  passport.serializeUser((user, done) => {
    // done -> 첫 번째 인수는 에러, 두 번째 인수는 저장하고 싶은 데이터
    // done을 이용해서 유저의 아이디만 저장 -> 세션 스토리지 용량 문제
    done(null, user.id);
  });
  // 매 요청 시 실행
  // 세션에 저장했던 아이디를 받아서 DB에서 조회
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "nick"], as: "Followers" },
        { model: User, attributes: ["id", "nick"], as: "Followings" },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
  local();
  kakao();
};
