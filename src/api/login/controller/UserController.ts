import passport from 'passport';

const jwt = require('jsonwebtoken');

namespace UserController {
	export async function signUp(req, res, next) {
		passport.authenticate('register', { session: false }, (err, user, info) => {
			if (err) {
				res.status(400);
			} else if (!user) {
				res.status(200).send('이미 가입된 이메일입니다.');
			} else {
				res.status(200).send('정상적으로 회원가입 되었습니다.');
			}
		})(req, res, next);
	}
	export function signIn(req, res, next) {
		passport.authenticate('local_login', { session: false }, (err, user, info) => {
			if (err) {
				return res.status(400);
			}
			if (!user) {
				return res.status(200).json({
					message: '로그인에 실패했습니다.',
					success: false,
				});
			}
			req.login(user, { session: false }, (err) => {
				if (err) {
					res.send(err);
				}
				const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET);
				return res.status(200).json({ userToken: token, success: true });
			});
		})(req, res);
	}
}

export default UserController;
