const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32).toString('hex');
const iv = crypto.randomBytes(16).toString('hex');


console.log(key, iv)