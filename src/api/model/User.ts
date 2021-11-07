interface User {
	idx: number;
	name: string;
	sub?: string;
	email: string;
}

export type loginType = 'guest' | 'google' | 'integrated';

export default User;
