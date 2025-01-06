export type JwtPayload = {
    sub: string;
    provider: string;
    iss: string;
    iat: number;
    exp: number;
    metadata?: Record<string, any>;
};
