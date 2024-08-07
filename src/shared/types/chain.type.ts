import { SUPPORTED_CHAIN_IDS } from '../constants/chain.constants'
import type { AccsDefaultParams } from '@lit-protocol/types'

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
export type LitChain = AccsDefaultParams['chain']
