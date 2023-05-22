const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

// encryption function
async function encryptPrivateKey(privateKey, password) {
  // generate a random salt
  const salt = crypto.randomBytes(16);
  // derive a key from the password using scrypt
  const key = await scrypt(password, salt, 32);
  // create an initialization vector
  const iv = crypto.randomBytes(16);
  // create a cipher using the key and initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  // encrypt the private key using the cipher
  const encryptedPrivateKey = cipher.update(privateKey) + cipher.final();
  // concatenate the salt and initialization vector to the encrypted data
  const result = Buffer.concat([salt, iv, encryptedPrivateKey]);
  return result.toString('hex');
}

// decryption function
async function decryptPrivateKey(encryptedPrivateKey, password) {
  // convert the encrypted data from hex to binary
  const data = Buffer.from(encryptedPrivateKey, 'hex');
  // extract the salt, initialization vector, and encrypted private key from the data
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 32);
  const encrypted = data.slice(32);
  // derive a key from the password and salt using scrypt
  const key = await scrypt(password, salt, 32);
  // create a decipher using the key and initialization vector
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  // decrypt the private key using the decipher
  const decryptedPrivateKey = decipher.update(encrypted) + decipher.final();
  return decryptedPrivateKey.toString();
}

module.exports = { encryptPrivateKey, decryptPrivateKey };