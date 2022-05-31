import React, { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Grid from "@mui/material/Grid";
import {
  apiClient,
  fetchAccountBalanceByChain,
  fetchTokensListByChain,
  fetchNFTsByAddress
} from "./api";
import { useAccount } from "wagmi";
import { supportedChains, SupportedChain } from "./types";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function App() {
  const { data: account } = useAccount();

  const [balances, setBalances] = useState<{
    [chainId in SupportedChain]: string;
  }>(
    supportedChains.reduce((p, c) => {
      return {
        ...p,
        [c]: "0",
      };
    }, {} as any)
  );

  const [allTokens, setTokensList] = useState<{
    [chainId in SupportedChain]: {    name: string;
      address: string;
      decimals: number;
      blockchain: SupportedChain,
      thumbnail: string;
      symbol: string}[];
  }>(
    supportedChains.reduce((p, c) => {
      return {
        ...p,
        [c]: [],
      };
    }, {} as any)
  );

  //fetchAccountBalanceByChain
  useEffect(() => {
    if (account && account.address) {
      supportedChains.forEach((chain) => {
        fetchAccountBalanceByChain(chain, (account as any).address).then(
          (balance) => {
            setBalances((b) => {
              return {
                ...b,
                [chain]: balance,
              };
            });
          }
        );
//fetchTokensListByChain
        fetchTokensListByChain(chain).then((list) => {
          setTokensList((p) => {
            return {
              ...p,
              [chain]: list,
            };
          });
        });
//fetchNFTsByAddress
        fetchNFTsByAddress(chain, (account as any).address).then(nftList => {
          console.log(nftList)
        })

      });
    }
  }, [account]);


  const [selectedChain, setSelectedChain] = useState<SupportedChain>("eth");
  const tokensList = useMemo(() => {
    return allTokens[selectedChain]
  }, [selectedChain, allTokens])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h1>Defi Dashboard</h1>
        </div>
        <div>
          <p
            style={{
              textAlign: "center",
            }}
          >
            Displays account balance, NFTs, which currencies exist on a
            blockchain, how many token holders a currency has, and token prices
            — all fueled directly by on-chain data. <br />
            <b>yo, what's in your wallet?</b>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ConnectButton />
        </div>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <InputLabel>Age</InputLabel>
          <Select
            value={selectedChain}
            label="tokenSelector"
            onChange={(val) => {
              setSelectedChain(val.target.value as SupportedChain);
            }}
          >
            {supportedChains.map((i) => (
              <MenuItem value={i}>{i}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {tokensList.map((value, index) => (
            <ListItem key={value.symbol + index.toString()}>
              <ListItemText primary={`${value.name}`} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default App;
