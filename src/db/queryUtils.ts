import User from '../api/login/model/User';
import { UserUtils } from '../utils/UserUtils';
import dbConnection from './sqlconnection';

export function getUser(username: string, password: string, callback: (error, rows, fild) => void) {
	dbConnection.query(`SELECT * from USER WHERE username=${username}`, callback);
}

export function createUser(username: string, password: string, onSuccess: (user: User) => void) {
	dbConnection.query(`INSERT INTO USER(username,password) values("${username}","${password}")`, (error, result) => {
		const user: User = new User(result.insertId, username, password);
		onSuccess(user);
	});
}
