import { OAuth2Client, TokenPayload } from 'google-auth-library';

import { Router } from 'express';
import User from './model/User';
import dbConnection from '../db/sqlconnection';

const router = Router();

router.post(
	'/',
	(req, res, next) => {
		const { googleToken, googleId } = req.body;

		verify(googleToken, googleId)
			.then((parsed) => {
				req.app.locals.userInfo = parsed;
				next();
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send({ error });
			});
	},
	responseIfGoogleMember,
	createUser,
);

function responseIfGoogleMember(req, res, next) {
	const { sub } = req.app.locals.userInfo;
	dbConnection.query(`SELECT * from USER WHERE google_sub=${sub}`, (error, rows, fild) => {
		const user: User = rows[0];
		if (!!user) {
			res.send({ user, isNewComer: false, loginType: 'google' });
		} else {
			next();
		}
	});
}

function createUser(req, res, next) {
	const { sub, email, name } = req.app.locals.userInfo;
	dbConnection.query(
		`INSERT INTO USER(google_sub,email,name)  values("${sub}","${email}","${name}")`,
		(error, result) => {
			const user: User = { idx: result.insertId, name, email };
			res.send({ user, isNewComer: true, loginType: 'google' });
		},
	);
}

async function verify(googleToken: string, id: string): Promise<TokenPayload> {
	const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	const ticket = await client.verifyIdToken({
		idToken: googleToken,
		audience: process.env.GOOGLE_CLIENT_ID,
	});
	const payload = ticket.getPayload();

	return payload;
}

export default router;
