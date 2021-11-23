interface User {
	idx: number;
	username: string;
	password: string;
	sub?: string;
	email?: string;
}

export type loginType = 'guest' | 'google' | 'integrated';

export default User;
