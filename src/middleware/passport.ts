import { createUser, getUser } from '../db/queryUtils';

import User from '../api/login/model/User';
import { UserUtils } from '../utils/UserUtils';
import _LocalStrategy from 'passport-local';
import passport from 'passport';

const LocalStrategy = _LocalStrategy.Strategy;

passport.use(
	'register',
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		getUser(username, password, (_, rows, __) => {
			const user: User = rows[0];
			if (!!user) {
				return done(null, false);
			} else {
				return createUser(username, UserUtils.getEncrypted('sha1', password), (user) => {
					done(null, user);
				});
			}
		});
	}),
);

passport.use(
	'local_login',
	new LocalStrategy(function (username, password, done) {
		let encryptedPw = UserUtils.getEncrypted('sha1', password);
		getUser(username, password, (_, rows, __) => {
			const user: User = rows[0];

			console.log(user);
			if (!user || user?.password !== encryptedPw) {
				return done(null, false);
			} else {
				done(null, user);
			}
		});
		return;
	}),
);

export default passport;

// const JWTStrategy = passportJWt.Strategy;
// const ExtractJWT = passportJWt.ExtractJwt;

// const LocalStrategy = passportJWt.Strategy;

// const jwtOptions = {
// 	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
// 	secretOrKey: process.env.JWT_SECRET,
// };

// passport.use(
// 	'jwt',
// 	new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
// 		return;
// 	}),
// );
