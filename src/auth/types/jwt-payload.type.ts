export type JwtPayload = {
    sub: string // User ID or public key
    provider: string // Provider (e.g., google, discord, siwe)
    iss: string // Issuer
    iat: number // Issued at timestamp
    exp: number // Expiration timestamp
}
