import jwt from 'jsonwebtoken';

export interface PayloadJwt {
  sub: string;
  rol: string;
}

const secreto = (): string => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET no está definido en las variables de entorno');
  return s;
};

const expiracion = (): string => process.env.JWT_EXPIRACION ?? '15m';

export const firmarAccessToken = (payload: PayloadJwt): string =>
  jwt.sign(payload, secreto(), { expiresIn: expiracion() } as jwt.SignOptions);

export const verificarAccessToken = (token: string): PayloadJwt => {
  const decoded = jwt.verify(token, secreto());
  if (typeof decoded === 'string') {
    throw new jwt.JsonWebTokenError('Token inválido');
  }
  return decoded as PayloadJwt;
};
