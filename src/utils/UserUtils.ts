import crypto from 'crypto';
namespace UserUtils {
	export function getEncrypted(hash: string, str: string): string {
		return crypto.createHash(hash).update(str).digest('hex');
	}
}

export { UserUtils };
