export const ATTEST_TYPED_SIGNATURE =
    'Attest(address attester,bytes32 schema,address recipient,uint64 expirationTime,bool revocable,bytes32 refUID,bytes data,uint256 value,uint256 nonce,uint64 deadline)';
export const REVOKE_TYPED_SIGNATURE =
    'Revoke(address revoker,bytes32 schema,bytes32 uid,uint256 value,uint256 nonce,uint64 deadline)';
export const ATTEST_PRIMARY_TYPE = 'Attest';
export const REVOKE_PRIMARY_TYPE = 'Revoke';
export const ATTEST_TYPE = [
    { name: 'attester', type: 'address' },
    { name: 'schema', type: 'bytes32' },
    { name: 'recipient', type: 'address' },
    { name: 'expirationTime', type: 'uint64' },
    { name: 'revocable', type: 'bool' },
    { name: 'refUID', type: 'bytes32' },
    { name: 'data', type: 'bytes' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint64' },
];
export const REVOKE_TYPE = [
    { name: 'revoker', type: 'address' },
    { name: 'schema', type: 'bytes32' },
    { name: 'uid', type: 'bytes32' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint64' },
];
export const SCHEMA_TYPES =
    'bytes32 key, string provider, string secret, string metadata';
