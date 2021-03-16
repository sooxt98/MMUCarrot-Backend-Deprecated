import * as crypto from 'crypto'
const {algorithm, key, iv} = require('../../config.json').crypto

export class Encryption {
    static decrypt(text : string) {
		const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
		return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8')
    }
    
	static encrypt(text : string) {
		const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
		return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
	}
}