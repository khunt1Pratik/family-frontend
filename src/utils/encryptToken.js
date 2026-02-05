import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; 
const STATIC_TOKEN = import.meta.env.VITE_STATIC_TOKEN; 

export function getEncryptedToken() {
  // Backend expects AES with manual IV
  const IV = SECRET_KEY.substring(0, 16);

  const encrypted = CryptoJS.AES.encrypt(
    STATIC_TOKEN,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(IV),
    }
  ).toString();

  // console.log(encrypted)

  return encrypted;
}
