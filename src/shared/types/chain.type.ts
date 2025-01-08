import { SUPPORTED_CHAINS } from '../constants/chain.constants';
import type { AccsDefaultParams } from '@lit-protocol/types';

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number];
export type LitChain = AccsDefaultParams['chain'];
