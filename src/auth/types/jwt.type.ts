import { JWT_PROVIDERS, JWT_TYPES } from '../constants/jwt.constants'

export type JwtType = (typeof JWT_TYPES)[keyof typeof JWT_TYPES]

export type JwtProvider = (typeof JWT_PROVIDERS)[keyof typeof JWT_PROVIDERS]

export type JwtPayload = {
    type: JwtType // Types (e.g., user, discourseVerification)
    sub: string // User ID, public key, verification code
    provider?: JwtProvider // Provider (e.g., google, discord, siwe, discourse)
    iss: string // Issuer
    iat: number // Issued at timestamp
    exp: number // Expiration timestamp
}
