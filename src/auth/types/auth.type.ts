import {
    AUTH_METHODS,
    VERIFICATION_METHODS,
    OAUTH_METHODS,
} from '../constants/auth.constants'
export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS]
export type OAuthMethod = (typeof OAUTH_METHODS)[keyof typeof OAUTH_METHODS]
export type VerificationMethod =
    (typeof VERIFICATION_METHODS)[keyof typeof VERIFICATION_METHODS]
