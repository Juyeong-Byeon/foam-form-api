import User from '../model/User';
import jwt from 'jsonwebtoken';
import passport from 'passport';

namespace UserController {
	export async function signUp(req, res, next) {
		passport.authenticate('register', { session: false }, (err: Error, user: User, _) => {
			if (err) {
				res.status(500);
			} else if (!user) {
				res.status(200).send('이미 가입된 이메일입니다.');
			} else {
				res.status(200).send('정상적으로 회원가입 되었습니다.');
			}
		})(req, res, next);
	}
	export function signIn(req, res, next) {
		passport.authenticate('local_login', { session: false }, (err: Error, user: User, _) => {
			if (err) {
				res.status(500);
			} else if (!user) {
				res.status(200).json({
					message: '로그인에 실패했습니다.',
					success: false,
				});
			}
			req.login(user, { session: false }, (err) => {
				if (err) {
					res.send(err);
				}
				const token = jwt.sign({ user }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(200).json({ userToken: token, success: true });
			});
		})(req, res, next);
	}

	export function checkIsLoggedIn(req, res, next) {
		passport.authenticate('jwt', { session: false }, (err, user) => {
			if (err) {
				res.status(500).send('internal error');
			} else if (0 < user.idx) {
				req.app.locals.user = user;
				next();
			} else {
				res.status(403).send('로그인 필요');
			}
		})(req, res, next);
	}
}

export default UserController;
