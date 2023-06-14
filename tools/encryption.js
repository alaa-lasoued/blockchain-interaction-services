const bcrypt = require('bcrypt');

// Function to encrypt data
async function encryptData(data, password) {
  const saltRounds = 10;
  const encryptedData = await bcrypt.hash(data, saltRounds);
  return encryptedData;
}

// Function to decrypt data
async function decryptData(encryptedData, password) {
  const isPasswordMatch = await bcrypt.compare(password, encryptedData);
  if (!isPasswordMatch) {
    throw new Error('Invalid password');
  }
  return encryptedData;
}

module.exports = { encryptData, decryptData };