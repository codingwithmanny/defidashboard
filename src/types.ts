//fetch chains

export const supportedChains = ["eth", "bsc", "polygon", "arbitrum", "fantom", "avalanche"] as const;
export type SupportedChain = typeof supportedChains[number];
