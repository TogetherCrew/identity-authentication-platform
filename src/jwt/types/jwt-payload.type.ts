export interface BaseJwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
    iss?: string;
}

export interface VerificationJwtPayload extends BaseJwtPayload {
    code: string;
}

export interface AuthJwtPayload extends BaseJwtPayload {
    provider: string;
    metadata?: Record<string, any>;
}

export type JwtPayload = AuthJwtPayload | VerificationJwtPayload;
