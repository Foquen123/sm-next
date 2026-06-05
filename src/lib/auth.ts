// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';

// Кодируем секрет для использования в jose
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sign(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h') // Устанавливаем срок действия токена
    .sign(secret);
}

export async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null; // Токен недействителен
  }
}
