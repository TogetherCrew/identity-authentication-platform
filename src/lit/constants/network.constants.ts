import { LitNodeClientConfig } from '@lit-protocol/types'
import { LitNetwork, LIT_RPC } from '@lit-protocol/constants'

// // export const networkConfigs: LitNodeClientConfig[] = [
// //     {
// //         alertWhenUnauthorized: false,
// //         litNetwork: LitNetwork.DatilDev,
// //         debug: true,
// //     },

// ]

export const networks = {
    'datil-dev': {
        clientConfig: {
            alertWhenUnauthorized: false,
            litNetwork: LitNetwork.DatilDev,
            debug: true,
        },
        contractConfig: {
            network: LitNetwork.DatilDev,
            debug: true,
        },
        rpc: LIT_RPC.CHRONICLE_YELLOWSTONE,
    },
    'datil-test': {
        clientConfig: {
            alertWhenUnauthorized: false,
            litNetwork: LitNetwork.DatilTest,
            debug: true,
        },
        contractConfig: {
            network: LitNetwork.DatilTest,
            debug: true,
        },
        rpc: LIT_RPC.CHRONICLE_YELLOWSTONE,
    },
}
