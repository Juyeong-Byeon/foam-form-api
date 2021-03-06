import User from '../api/model/User';
import dbConnection from './sqlconnection';

export function getUser(username: string, callback: (error, rows, fild) => void) {
	dbConnection.query(`SELECT * from USER WHERE username="${username}"`, callback);
}

interface param {
	username?: string;
	password?: string;
	googlesub?: string;
	email?: string;
}

export function createUser(
	{ username = null, password = null, googlesub = null, email = null }: param,
	onSuccess?: (user: User) => void,
) {
	dbConnection.query(
		`INSERT INTO USER(username,password,google_sub,email) values("${username}","${password}","${googlesub}",${email})`,
		(error, result) => {
			const user: User = new User(result.insertId, username, password);
			console.log(error);
			onSuccess(user);
		},
	);
}
