const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = process.env.CHAT_SECRET_KEY || 'default_secret_key';  
const keyBuffer = crypto.createHash('sha256').update(secretKey).digest();
console.log('Key length:', keyBuffer.length);
console.log('Key (in hex):', keyBuffer.toString('hex'));

// Encrypt a message
function encryptMessage(message) {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);

    console.log('IV length:', iv.length);

    const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt a message
function decryptMessage(encryptedMessage) {
    if (!encryptedMessage || !encryptedMessage.includes(':')) {
        throw new Error('Invalid encrypted message format');
    }

    const [ivHex, contentHex] = encryptedMessage.split(':');

    if (ivHex.length !== 32) {
        throw new Error('IV Hex length is incorrect');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const content = Buffer.from(contentHex, 'hex');

    if (iv.length !== 16) {
        throw new Error('Invalid IV length');
    }

    try {
        const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
        const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error.message);
        throw new Error('Failed to decrypt the message');
    }
}


module.exports = { encryptMessage, decryptMessage };
