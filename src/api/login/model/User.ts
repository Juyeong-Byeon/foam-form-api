class User {
	constructor(
		public readonly idx: number,
		public readonly username: string,
		public readonly password: string,
		public readonly email?: string,
		public readonly sub?: string,
	) {}

	public getUserInfo() {
		return {
			idx: this.idx,
			username: this.username,
			sub: this.sub,
			email: this.email,
		};
	}
}

export type loginType = 'guest' | 'google' | 'integrated';

export default User;
