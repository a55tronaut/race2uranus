import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";

import {
  ARBISCAN_API_KEY,
  MAINNET_DEPLOYER_PK,
  TESTNET_DEPLOYER_PK,
} from "./env";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
  networks: {
    arbrin: {
      url: "https://rinkeby.arbitrum.io/rpc",
      accounts: [TESTNET_DEPLOYER_PK],
    },
    arbgor: {
      url: "https://goerli-rollup.arbitrum.io/rpc/",
      accounts: [TESTNET_DEPLOYER_PK],
    },
    arb: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [MAINNET_DEPLOYER_PK],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumGoerli: "a",
      arbitrumTestnet: ARBISCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
    },
    customChains: [
      {
        network: "arbitrumGoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://goerli-rollup-explorer.arbitrum.io/api",
          browserURL: "https://goerli-rollup-explorer.arbitrum.io/",
        },
      },
    ],
  },
};

export default config;
