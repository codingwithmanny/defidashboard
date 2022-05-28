import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Grid from "@mui/material/Grid";

import axios from "axios";
import { useAccount } from "wagmi";
const apiClient = axios.create({
  baseURL: "https://rpc.ankr.com/multichain",
  headers: {
    "Content-type": "application/json"
  }
});

function App() {
  const {
    data: account
  } = useAccount();

 //triggered when parameters change
  useEffect(() => {
    if (account && account.address) {
      apiClient.post('/', 
        {
          jsonrpc: "2.0",
          method: "ankr_getAccountBalance",
          params: {
              blockchain: "eth",
              walletAddress: account.address
          },
          id: 1
      }
      ).then((response) => {
        console.log(response.data)
      })
    }
  }, [account]);



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
          <p style={{
          textAlign: "center"
        }}>
            Displays account balance, which currencies exist on a blockchain, how
            many token holders a currency has, and token prices — all fueled
            directly by on-chain data. <br />
            <b>yo, what's in your wallet?</b>
          </p>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <ConnectButton />
        </div>
      </Grid>
    </Grid>
  );
}

export default App;
