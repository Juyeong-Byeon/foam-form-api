import User from '../model/User';
import jwt from 'jsonwebtoken';
import passport from 'passport';

namespace UserController {
	export async function signUp(req, res, next) {
		passport.authenticate('local_register', { session: false }, (err: Error, user: User, _) => {
			if (err) {
				res.status(500);
			} else if (!user) {
				res.status(200).send({ success: false, message: '이미 가입된 이메일입니다.' });
			} else {
				res.status(200).send({ success: true, message: '정상적으로 회원가입 되었습니다.' });
			}
		})(req, res, next);
	}
	export function signIn(req, res, next) {
		passport.authenticate('local_login', { session: false }, (error: Error, user: User, _) => {
			if (error) {
				res.status(500).send(error);
			}

			req.login(user, { session: false }, (err) => {
				if (err) {
					res.status(500).send(err);
				} else if (!user) {
					res.status(200).json({
						message: '로그인에 실패했습니다.',
						success: false,
					});
				}

				const token = jwt.sign({ user }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(200).json({ userToken: token, success: true });
			});
		})(req, res, next);
	}

	export async function signUpWithGoogle(req, res, next) {
		passport.authenticate('google_register', { session: false }, (err: Error, user: User, _) => {
			if (err) {
				res.status(500);
			} else if (!user) {
				res.status(200).send({ success: false, message: '이미 가입된 이메일입니다.' });
			} else {
				res.status(200).send({ success: true, message: '정상적으로 회원가입 되었습니다.' });
			}
		})(req, res, next);
	}

	export function signInWithGoogle(req, res, next) {
		console.log('!');
		passport.authenticate('google_login', { session: false }, (error: Error, user: User, _) => {
			console.log('!!');
			if (error) {
				res.status(500).send(error);
			}

			req.login(user, { session: false }, (err) => {
				if (err) {
					res.status(500).send(err);
				} else if (!user) {
					res.status(200).json({
						message: '로그인에 실패했습니다.',
						success: false,
					});
				}

				const token = jwt.sign({ user }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(200).json({ userToken: token, success: true });
			});
		});
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
