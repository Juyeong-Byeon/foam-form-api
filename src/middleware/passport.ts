import { createUser, getUser } from '../db/queryUtils';

import GoogleTokenStrategy from 'passport-google-id-token';
import User from '../api/login/model/User';
import { UserUtils } from '../utils/UserUtils';
import _LocalStrategy from 'passport-local';
import dbConnection from '../db/sqlconnection';
import passport from 'passport';
import passportJWT from 'passport-jwt';

const JWTStrategy = passportJWT.Strategy;
const Extract = passportJWT.ExtractJwt;

const LocalStrategy = _LocalStrategy.Strategy;

const option = {
	jwtFromRequest: Extract.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

passport.use(
	'jwt',
	new JWTStrategy(option, ({ user }, done) => {
		return !!user ? done(null, user) : done(new Error('INVALID_USER'), false);
	}),
);

passport.use(
	'google',
	new GoogleTokenStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
		},
		function (parsedToken, googleId, done) {
			dbConnection.query(`SELECT * from USER WHERE google_sub=${parsedToken.sub}`, (error, rows, fild) => {
				const user: User = rows[0];
				if (!!user) {
					done(null, user);
				} else {
				}
			});
		},
	),
);

passport.use(
	'google_register',
	new GoogleTokenStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
		},
		function (parsedToken, googleId, done) {
			dbConnection.query(`SELECT * from USER WHERE google_sub=${parsedToken.sub}`, (error, rows, fild) => {
				const user: User = rows[0];
				if (!!user) {
					done(null, false);
				} else {
					console.log(parsedToken);
					return createUser(
						{
							username: null,
							password: null,
							googlesub: parsedToken.sub,
							email: parsedToken.email,
						},
						(user) => {
							done(null, user);
						},
					);
				}
			});
		},
	),
);

passport.use(
	'local_register',
	new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
		getUser(username, (_, rows, __) => {
			const user: User = rows[0];
			if (!!user) {
				return done(null, false);
			} else {
				return createUser(
					{
						username,
						password: UserUtils.getEncrypted('sha1', password),
					},
					(user) => {
						done(null, user);
					},
				);
			}
		});
	}),
);

passport.use(
	'local_login',
	new LocalStrategy(function (username, password, done) {
		let encryptedPw = UserUtils.getEncrypted('sha1', password);
		getUser(username, (_, rows, __) => {
			const user: User = rows[0];

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
