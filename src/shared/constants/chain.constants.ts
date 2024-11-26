export const SUPPORTED_CHAINS = [11155111, 11155420, 84532] // Ethereum Sepolia - Optimism Sepolia - Base Sepolia

export const CHAINS = {
    11155111: {
        rpcURL: 'https://ethereum-sepolia-rpc.publicnode.com',
        eas: {
            address: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
            schema: '0x85e90e3e16d319578888790af3284fea8bca549305071531e7478e3e0b5e7d6d',
        },
    },
    11155420: {
        rpcURL: 'https://sepolia.optimism.io',
        eas: {
            address: '0x4200000000000000000000000000000000000021',
            schema: '0x8d7b74f67b01c22649d36c03ff17fd382351ccecc002f4163e436c0bb74d3949',
        },
    },
    84532: {
        rpcURL: 'https://sepolia.base.org',
        eas: {
            address: '0x4200000000000000000000000000000000000021',
            schema: '0xe8c59f8de4cdf61c8ebefa3ed83d714acc767dda3bbff00623e73f5a8bf5255f',
        },
    },
}

export const PERMISSION_CONTRACTS = {
    11155111: {
        address: '0x787aeDd9Fb3e16EeF5b00C0F35f105daD2A1aA15',
        abi: [
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'initialAuthority',
                        type: 'address',
                    },
                    {
                        internalType: 'contract IEAS',
                        name: 'initialEAS',
                        type: 'address',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'constructor',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'authority',
                        type: 'address',
                    },
                ],
                name: 'AccessManagedInvalidAuthority',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                ],
                name: 'AccessManagedRequiredDelay',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                ],
                name: 'AccessManagedUnauthorized',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'attestation_uid',
                        type: 'bytes32',
                    },
                ],
                name: 'AttestationNotFound',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'attestation_uid',
                        type: 'bytes32',
                    },
                ],
                name: 'AttestationRevoked',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                ],
                name: 'UnauthorizedAccess',
                type: 'error',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'authority',
                        type: 'address',
                    },
                ],
                name: 'AuthorityUpdated',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'bytes32',
                        name: 'key',
                        type: 'bytes32',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'granted',
                        type: 'bool',
                    },
                ],
                name: 'PermissionUpdated',
                type: 'event',
            },
            {
                inputs: [],
                name: 'authority',
                outputs: [
                    {
                        internalType: 'address',
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'eas',
                outputs: [
                    {
                        internalType: 'contract IEAS',
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'attestation_uid',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'grantPermission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'key',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasPermission',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'isConsumingScheduledOp',
                outputs: [
                    {
                        internalType: 'bytes4',
                        name: '',
                        type: 'bytes4',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'attestation_uid',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'revokePermission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'newAuthority',
                        type: 'address',
                    },
                ],
                name: 'setAuthority',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        metadata: {
            hasPermissionFunctionName: 'hasPermission',
            hasPermissionAbi: {
                inputs: [
                    { internalType: 'bytes32', name: 'key', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasPermission',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
        },
    },
    11155420: {
        address: '0xFcE488b93696Ec5e279b8257E67F074AbFEc59d8',
        abi: [
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'bytes32',
                        name: 'uid',
                        type: 'bytes32',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'granted',
                        type: 'bool',
                    },
                ],
                name: 'PermissionDeleted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'bytes32',
                        name: 'uid',
                        type: 'bytes32',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'granted',
                        type: 'bool',
                    },
                ],
                name: 'PermissionUpdated',
                type: 'event',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'grantPermission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasPermission',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'revokePermission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        metadata: {
            hasPermissionFunctionName: 'hasPermission',
            hasPermissionAbi: {
                inputs: [
                    { internalType: 'bytes32', name: 'key', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasPermission',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
        },
    },
    84532: {
        address: '0xF65e300B0e622B1Bc224c7351397ea2FF29f1c3D',
        abi: [
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'bytes32',
                        name: 'uid',
                        type: 'bytes32',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'granted',
                        type: 'bool',
                    },
                ],
                name: 'PermissionDeleted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'bytes32',
                        name: 'uid',
                        type: 'bytes32',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'granted',
                        type: 'bool',
                    },
                ],
                name: 'PermissionUpdated',
                type: 'event',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'grantPermission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasPermission',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'uid', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'revokePermission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        metadata: {
            hasPermissionFunctionName: 'hasPermission',
            hasPermissionAbi: {
                inputs: [
                    { internalType: 'bytes32', name: 'key', type: 'bytes32' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasPermission',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
        },
    },
}

export const ACCESS_MANAGER_CONTRACTS = {
    11155111: {
        address: '0x946F4b6EA3AD07Cd4eed93D1baD54Ac2c948e0C0',
        abi: [
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerAlreadyScheduled',
                type: 'error',
            },
            { inputs: [], name: 'AccessManagerBadConfirmation', type: 'error' },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerExpired',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'initialAdmin',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerInvalidInitialAdmin',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerLockedAccount',
                type: 'error',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                ],
                name: 'AccessManagerLockedRole',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerNotReady',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerNotScheduled',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'msgsender',
                        type: 'address',
                    },
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                ],
                name: 'AccessManagerUnauthorizedAccount',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'AccessManagerUnauthorizedCall',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'msgsender',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'AccessManagerUnauthorizedCancel',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerUnauthorizedConsume',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'AddressEmptyCode',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'AddressInsufficientBalance',
                type: 'error',
            },
            { inputs: [], name: 'FailedInnerCall', type: 'error' },
            { inputs: [], name: 'InvalidInitialization', type: 'error' },
            { inputs: [], name: 'NotInitializing', type: 'error' },
            {
                inputs: [
                    { internalType: 'uint8', name: 'bits', type: 'uint8' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'SafeCastOverflowedUintDowncast',
                type: 'error',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'uint64',
                        name: 'version',
                        type: 'uint64',
                    },
                ],
                name: 'Initialized',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                name: 'OperationCanceled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                name: 'OperationExecuted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'schedule',
                        type: 'uint48',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'OperationScheduled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'admin',
                        type: 'uint64',
                    },
                ],
                name: 'RoleAdminChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                ],
                name: 'RoleGrantDelayChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'newMember',
                        type: 'bool',
                    },
                ],
                name: 'RoleGranted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'guardian',
                        type: 'uint64',
                    },
                ],
                name: 'RoleGuardianChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: false,
                        internalType: 'string',
                        name: 'label',
                        type: 'string',
                    },
                ],
                name: 'RoleLabel',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'RoleRevoked',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                ],
                name: 'TargetAdminDelayUpdated',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'closed',
                        type: 'bool',
                    },
                ],
                name: 'TargetClosed',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'TargetFunctionRoleUpdated',
                type: 'event',
            },
            {
                inputs: [],
                name: 'ADMIN_ROLE',
                outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PUBLIC_ROLE',
                outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'canCall',
                outputs: [
                    { internalType: 'bool', name: 'immediate', type: 'bool' },
                    { internalType: 'uint32', name: 'delay', type: 'uint32' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'cancel',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'consumeScheduledOp',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'execute',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'payable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'expiration',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'getAccess',
                outputs: [
                    { internalType: 'uint48', name: 'since', type: 'uint48' },
                    {
                        internalType: 'uint32',
                        name: 'currentDelay',
                        type: 'uint32',
                    },
                    {
                        internalType: 'uint32',
                        name: 'pendingDelay',
                        type: 'uint32',
                    },
                    { internalType: 'uint48', name: 'effect', type: 'uint48' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'id', type: 'bytes32' },
                ],
                name: 'getNonce',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                ],
                name: 'getRoleAdmin',
                outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                ],
                name: 'getRoleGrantDelay',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                ],
                name: 'getRoleGuardian',
                outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes32', name: 'id', type: 'bytes32' },
                ],
                name: 'getSchedule',
                outputs: [{ internalType: 'uint48', name: '', type: 'uint48' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'getTargetAdminDelay',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'getTargetFunctionRole',
                outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                name: 'grantRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasRole',
                outputs: [
                    { internalType: 'bool', name: 'isMember', type: 'bool' },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    { internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'hashOperation',
                outputs: [
                    { internalType: 'bytes32', name: '', type: 'bytes32' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'isTargetClosed',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    { internalType: 'string', name: 'label', type: 'string' },
                ],
                name: 'labelRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'minSetback',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
                ],
                name: 'multicall',
                outputs: [
                    {
                        internalType: 'bytes[]',
                        name: 'results',
                        type: 'bytes[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'callerConfirmation',
                        type: 'address',
                    },
                ],
                name: 'renounceRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'revokeRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    { internalType: 'bytes', name: 'data', type: 'bytes' },
                    { internalType: 'uint48', name: 'when', type: 'uint48' },
                ],
                name: 'schedule',
                outputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    { internalType: 'uint32', name: 'nonce', type: 'uint32' },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'uint32',
                        name: 'newDelay',
                        type: 'uint32',
                    },
                ],
                name: 'setGrantDelay',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    { internalType: 'uint64', name: 'admin', type: 'uint64' },
                ],
                name: 'setRoleAdmin',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'uint64',
                        name: 'guardian',
                        type: 'uint64',
                    },
                ],
                name: 'setRoleGuardian',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'newDelay',
                        type: 'uint32',
                    },
                ],
                name: 'setTargetAdminDelay',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    { internalType: 'bool', name: 'closed', type: 'bool' },
                ],
                name: 'setTargetClosed',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4[]',
                        name: 'selectors',
                        type: 'bytes4[]',
                    },
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                ],
                name: 'setTargetFunctionRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'newAuthority',
                        type: 'address',
                    },
                ],
                name: 'updateAuthority',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        metadata: {
            hasRoleFunctionName: 'hasRole',
            hasRoleAbi: {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasRole',
                outputs: [
                    { internalType: 'bool', name: 'isMember', type: 'bool' },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            HasRoleRoleId: '3',
        },
    },
    11155420: {
        address: '0x07d53fDeAb271f25648D4c1f600D267C87be608a',
        abi: [
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerAlreadyScheduled',
                type: 'error',
            },
            {
                inputs: [],
                name: 'AccessManagerBadConfirmation',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerExpired',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'initialAdmin',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerInvalidInitialAdmin',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'AccessManagerLockedRole',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerNotReady',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerNotScheduled',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'msgsender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'AccessManagerUnauthorizedAccount',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'AccessManagerUnauthorizedCall',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'msgsender',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'AccessManagerUnauthorizedCancel',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerUnauthorizedConsume',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'AddressEmptyCode',
                type: 'error',
            },
            {
                inputs: [],
                name: 'FailedCall',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'balance',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'needed',
                        type: 'uint256',
                    },
                ],
                name: 'InsufficientBalance',
                type: 'error',
            },
            {
                inputs: [],
                name: 'InvalidInitialization',
                type: 'error',
            },
            {
                inputs: [],
                name: 'NotInitializing',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint8',
                        name: 'bits',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'SafeCastOverflowedUintDowncast',
                type: 'error',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'uint64',
                        name: 'version',
                        type: 'uint64',
                    },
                ],
                name: 'Initialized',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                name: 'OperationCanceled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                name: 'OperationExecuted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'schedule',
                        type: 'uint48',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'OperationScheduled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'admin',
                        type: 'uint64',
                    },
                ],
                name: 'RoleAdminChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                ],
                name: 'RoleGrantDelayChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'newMember',
                        type: 'bool',
                    },
                ],
                name: 'RoleGranted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'guardian',
                        type: 'uint64',
                    },
                ],
                name: 'RoleGuardianChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: false,
                        internalType: 'string',
                        name: 'label',
                        type: 'string',
                    },
                ],
                name: 'RoleLabel',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'RoleRevoked',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                ],
                name: 'TargetAdminDelayUpdated',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'closed',
                        type: 'bool',
                    },
                ],
                name: 'TargetClosed',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'TargetFunctionRoleUpdated',
                type: 'event',
            },
            {
                inputs: [],
                name: 'ADMIN_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'APPLICATION_MANAGER_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'ATTESTATION_MANAGER_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PERMISSION_MANAGER_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PUBLIC_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'canCall',
                outputs: [
                    {
                        internalType: 'bool',
                        name: 'immediate',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'cancel',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'consumeScheduledOp',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'execute',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'payable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'expiration',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'getAccess',
                outputs: [
                    {
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                    {
                        internalType: 'uint32',
                        name: 'currentDelay',
                        type: 'uint32',
                    },
                    {
                        internalType: 'uint32',
                        name: 'pendingDelay',
                        type: 'uint32',
                    },
                    {
                        internalType: 'uint48',
                        name: 'effect',
                        type: 'uint48',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'id',
                        type: 'bytes32',
                    },
                ],
                name: 'getNonce',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'getRoleAdmin',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'getRoleGrantDelay',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'getRoleGuardian',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'id',
                        type: 'bytes32',
                    },
                ],
                name: 'getSchedule',
                outputs: [
                    {
                        internalType: 'uint48',
                        name: '',
                        type: 'uint48',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'getTargetAdminDelay',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'getTargetFunctionRole',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                name: 'grantRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasRole',
                outputs: [
                    {
                        internalType: 'bool',
                        name: 'isMember',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'hashOperation',
                outputs: [
                    {
                        internalType: 'bytes32',
                        name: '',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'initialAdmin',
                        type: 'address',
                    },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'isTargetClosed',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'string',
                        name: 'label',
                        type: 'string',
                    },
                ],
                name: 'labelRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'minSetback',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes[]',
                        name: 'data',
                        type: 'bytes[]',
                    },
                ],
                name: 'multicall',
                outputs: [
                    {
                        internalType: 'bytes[]',
                        name: 'results',
                        type: 'bytes[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'callerConfirmation',
                        type: 'address',
                    },
                ],
                name: 'renounceRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'revokeRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                    {
                        internalType: 'uint48',
                        name: 'when',
                        type: 'uint48',
                    },
                ],
                name: 'schedule',
                outputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint32',
                        name: 'newDelay',
                        type: 'uint32',
                    },
                ],
                name: 'setGrantDelay',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'admin',
                        type: 'uint64',
                    },
                ],
                name: 'setRoleAdmin',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'guardian',
                        type: 'uint64',
                    },
                ],
                name: 'setRoleGuardian',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'newDelay',
                        type: 'uint32',
                    },
                ],
                name: 'setTargetAdminDelay',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'closed',
                        type: 'bool',
                    },
                ],
                name: 'setTargetClosed',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4[]',
                        name: 'selectors',
                        type: 'bytes4[]',
                    },
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'setTargetFunctionRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'newAuthority',
                        type: 'address',
                    },
                ],
                name: 'updateAuthority',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        metadata: {
            hasRoleFunctionName: 'hasRole',
            hasRoleAbi: {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasRole',
                outputs: [
                    { internalType: 'bool', name: 'isMember', type: 'bool' },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            HasRoleRoleId: '3',
        },
    },
    84532: {
        address: '0x8194157B9464683E552c810b4FEA66251435606b',
        abi: [
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerAlreadyScheduled',
                type: 'error',
            },
            {
                inputs: [],
                name: 'AccessManagerBadConfirmation',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerExpired',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'initialAdmin',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerInvalidInitialAdmin',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'AccessManagerLockedRole',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerNotReady',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                ],
                name: 'AccessManagerNotScheduled',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'msgsender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'AccessManagerUnauthorizedAccount',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'AccessManagerUnauthorizedCall',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'msgsender',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'AccessManagerUnauthorizedCancel',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'AccessManagerUnauthorizedConsume',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'AddressEmptyCode',
                type: 'error',
            },
            {
                inputs: [],
                name: 'FailedCall',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'balance',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'needed',
                        type: 'uint256',
                    },
                ],
                name: 'InsufficientBalance',
                type: 'error',
            },
            {
                inputs: [],
                name: 'InvalidInitialization',
                type: 'error',
            },
            {
                inputs: [],
                name: 'NotInitializing',
                type: 'error',
            },
            {
                inputs: [
                    {
                        internalType: 'uint8',
                        name: 'bits',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256',
                    },
                ],
                name: 'SafeCastOverflowedUintDowncast',
                type: 'error',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: false,
                        internalType: 'uint64',
                        name: 'version',
                        type: 'uint64',
                    },
                ],
                name: 'Initialized',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                name: 'OperationCanceled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                name: 'OperationExecuted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        indexed: true,
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'schedule',
                        type: 'uint48',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'OperationScheduled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'admin',
                        type: 'uint64',
                    },
                ],
                name: 'RoleAdminChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                ],
                name: 'RoleGrantDelayChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'newMember',
                        type: 'bool',
                    },
                ],
                name: 'RoleGranted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'guardian',
                        type: 'uint64',
                    },
                ],
                name: 'RoleGuardianChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: false,
                        internalType: 'string',
                        name: 'label',
                        type: 'string',
                    },
                ],
                name: 'RoleLabel',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'RoleRevoked',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                    {
                        indexed: false,
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                ],
                name: 'TargetAdminDelayUpdated',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bool',
                        name: 'closed',
                        type: 'bool',
                    },
                ],
                name: 'TargetClosed',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        indexed: false,
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                    {
                        indexed: true,
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'TargetFunctionRoleUpdated',
                type: 'event',
            },
            {
                inputs: [],
                name: 'ADMIN_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'APPLICATION_MANAGER_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'ATTESTATION_MANAGER_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PERMISSION_MANAGER_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PUBLIC_ROLE',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'canCall',
                outputs: [
                    {
                        internalType: 'bool',
                        name: 'immediate',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint32',
                        name: 'delay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'cancel',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'consumeScheduledOp',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'execute',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'payable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'expiration',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'getAccess',
                outputs: [
                    {
                        internalType: 'uint48',
                        name: 'since',
                        type: 'uint48',
                    },
                    {
                        internalType: 'uint32',
                        name: 'currentDelay',
                        type: 'uint32',
                    },
                    {
                        internalType: 'uint32',
                        name: 'pendingDelay',
                        type: 'uint32',
                    },
                    {
                        internalType: 'uint48',
                        name: 'effect',
                        type: 'uint48',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'id',
                        type: 'bytes32',
                    },
                ],
                name: 'getNonce',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'getRoleAdmin',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'getRoleGrantDelay',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'getRoleGuardian',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes32',
                        name: 'id',
                        type: 'bytes32',
                    },
                ],
                name: 'getSchedule',
                outputs: [
                    {
                        internalType: 'uint48',
                        name: '',
                        type: 'uint48',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'getTargetAdminDelay',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4',
                        name: 'selector',
                        type: 'bytes4',
                    },
                ],
                name: 'getTargetFunctionRole',
                outputs: [
                    {
                        internalType: 'uint64',
                        name: '',
                        type: 'uint64',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                name: 'grantRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasRole',
                outputs: [
                    {
                        internalType: 'bool',
                        name: 'isMember',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'caller',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                ],
                name: 'hashOperation',
                outputs: [
                    {
                        internalType: 'bytes32',
                        name: '',
                        type: 'bytes32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'initialAdmin',
                        type: 'address',
                    },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                ],
                name: 'isTargetClosed',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'string',
                        name: 'label',
                        type: 'string',
                    },
                ],
                name: 'labelRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'minSetback',
                outputs: [
                    {
                        internalType: 'uint32',
                        name: '',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'bytes[]',
                        name: 'data',
                        type: 'bytes[]',
                    },
                ],
                name: 'multicall',
                outputs: [
                    {
                        internalType: 'bytes[]',
                        name: 'results',
                        type: 'bytes[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'callerConfirmation',
                        type: 'address',
                    },
                ],
                name: 'renounceRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'revokeRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes',
                    },
                    {
                        internalType: 'uint48',
                        name: 'when',
                        type: 'uint48',
                    },
                ],
                name: 'schedule',
                outputs: [
                    {
                        internalType: 'bytes32',
                        name: 'operationId',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'uint32',
                        name: 'nonce',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint32',
                        name: 'newDelay',
                        type: 'uint32',
                    },
                ],
                name: 'setGrantDelay',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'admin',
                        type: 'uint64',
                    },
                ],
                name: 'setRoleAdmin',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'guardian',
                        type: 'uint64',
                    },
                ],
                name: 'setRoleGuardian',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'uint32',
                        name: 'newDelay',
                        type: 'uint32',
                    },
                ],
                name: 'setTargetAdminDelay',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'closed',
                        type: 'bool',
                    },
                ],
                name: 'setTargetClosed',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4[]',
                        name: 'selectors',
                        type: 'bytes4[]',
                    },
                    {
                        internalType: 'uint64',
                        name: 'roleId',
                        type: 'uint64',
                    },
                ],
                name: 'setTargetFunctionRole',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'target',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'newAuthority',
                        type: 'address',
                    },
                ],
                name: 'updateAuthority',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        metadata: {
            hasRoleFunctionName: 'hasRole',
            hasRoleAbi: {
                inputs: [
                    { internalType: 'uint64', name: 'roleId', type: 'uint64' },
                    {
                        internalType: 'address',
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'hasRole',
                outputs: [
                    { internalType: 'bool', name: 'isMember', type: 'bool' },
                    {
                        internalType: 'uint32',
                        name: 'executionDelay',
                        type: 'uint32',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            HasRoleRoleId: '3',
        },
    },
}
