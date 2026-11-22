// Simple demo-grade hash so passwords are not saved as plain text on the device.
// This is NOT real security. When the app gets a backend, send the password over HTTPS and let the server hash it (bcrypt/argon2).
export function hashPassword(pw = '') {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) | 0;
  return `${h >>> 0}:${pw.length}`;
}
