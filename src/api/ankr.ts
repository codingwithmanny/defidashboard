import axios from "axios";
import { useAccount } from "wagmi";
import {SupportedChain} from "../types";

export const apiClient = axios.create({
  baseURL: "https://rpc.ankr.com/multichain",
  headers: {
    "Content-type": "application/json"
  }
});

export async function fetchAccountBalanceByChain(chain: SupportedChain, address: string): Promise<string> {
    try {
        let balance = "0";

        const apiResponse = await apiClient.post('/', {
            jsonrpc: "2.0",
            method: "ankr_getAccountBalance",
            params: {
                blockchain: chain,
                walletAddress: address
            },
            id: 1
        });

        if (!apiResponse.data || !apiResponse.data.result) throw new Error('Error fetching Reponse')

        return apiResponse.data.result.totalBalanceUsd;
    } catch (err) {
        return "0";
    }
}

export async function fetchTokensListByChain(chain: SupportedChain): Promise<{
    name: string;
    address: string;
    decimals: number;
    blockchain: SupportedChain,
    thumbnail: string;
    symbol: string
}[]> {
    try {
        const apiResponse = await apiClient.post('/', {
          "jsonrpc": "2.0",
          "method": "ankr_getCurrencies",
          "params": {
              "blockchain": chain
          },
          "id": 1
        })

        if (!apiResponse.data || !apiResponse.data.result) throw new Error('Error fetching Reponse')

        return apiResponse.data.result.currencies;
    } catch (err) {
        return [];
    }
}



export async function fetchNFTsByAddress(chain: SupportedChain, address: string): Promise<{
    blockchain: string;
    name: string;
    tokenId: string;
    tokenUrl: string;
    imageUrl: string;
    collectionName: string;
    symbol: string;
    contractType: string;
    contractAddress: string;
}[]> {
    try {
        const apiResponse = await apiClient.post('/', {
          "jsonrpc": "2.0",
          "method": "ankr_getNFTsByOwner",
          "params": {
              "blockchain": chain,
              "walletAddress": address,
              "pageSize": 50,
              "pageToken": ""
          },
          "id": 1
        })

        if (!apiResponse.data || !apiResponse.data.result) throw new Error('Error fetching Reponse')

        return apiResponse.data.result.assets;
    } catch (err) {
        return [];
    }
}