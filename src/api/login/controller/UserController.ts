import User from '../../model/User';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import {AuthResponse} from '../model/AuthResponse';

namespace UserController {
	export async function signUp(req, res, next) {
		passport.authenticate('local_register', { session: false }, (err: Error, user: User, _) => {

			if (err) {
				res.status(500).send(new AuthResponse('ERROR',null));
			} else if (!user) {
				res.status(200).send(new AuthResponse('EXIST',null));
			} else {
				res.status(200).send(new AuthResponse('SUCCESS',null));
			}
		})(req, res, next);
	}
	export function signIn(req, res, next) {
		passport.authenticate('local_login', { session: false }, (error: Error, user: User, _) => {
			if (error) {
				res.status(500).send(new AuthResponse('ERROR',null));
			}

			req.login(user, { session: false }, (err) => {
				if (err) {
					res.status(500).send(new AuthResponse('ERROR',null));
				} else if (!user) {
					res.status(200).send(new AuthResponse('WRONG_PW_OR_ID',null));
				}
				const token = jwt.sign({ user }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(200).json(new AuthResponse('SUCCESS',{userToken:token}));
			});
		})(req, res, next);
	}

	export async function signUpWithGoogle(req, res, next) {
		passport.authenticate('google_register', { session: false }, (err: Error, user: User, _) => {
			if (err) {
				res.status(500).send(new AuthResponse('ERROR',null));
			} else if (!user) {
				res.status(200).send(new AuthResponse('EXIST',null));
			} else {
				res.status(200).json(new AuthResponse('SUCCESS',null));
			}
		})(req, res, next);
	}

	export function signInWithGoogle(req, res, next) {
		passport.authenticate('google_login', { session: false }, (error: Error, user: User, _) => {
			if (error) {
				res.status(500).send(new AuthResponse('ERROR',null));
			}

			req.login(user, { session: false }, (err) => {
				if (err) {
					res.status(500).send(new AuthResponse('ERROR',null));
				} else if (!user) {
					res.status(200).send(new AuthResponse('WRONG_PW_OR_ID',null))
				}

				const token = jwt.sign({ user }, process.env.JWT_SECRET, {
					expiresIn: '1h',
				});
				res.status(200).json(new AuthResponse('SUCCESS',{userToken:token}));
			});
		});
	}

	export function checkIsLoggedIn(req, res, next) {
		passport.authenticate('jwt', { session: false }, (err, user) => {
			if (err) {
				res.status(500).send(new AuthResponse('ERROR',null));
			} else if (0 < user.idx) {
				req.app.locals.user = user;
				next();
			} else {
				res.status(403).send(new AuthResponse('LOGIN_REQUIRE',null));
			}
		})(req, res, next);
	}
}

export default UserController;
