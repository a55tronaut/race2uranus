import { DAppProvider, Config, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';

import { CHAIN_ID, L1_CHAIN_ID, L1_RPC_URL, RPC_URL } from '../env';

interface IProps {
  children: React.ReactNode;
}

const config: Config = {
  autoConnect: true,
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: RPC_URL,
    [L1_CHAIN_ID]: L1_RPC_URL,
  },
  pollingInterval: 10000,
  refresh: 'never',
  networks: [
    ...DEFAULT_SUPPORTED_CHAINS,
    {
      chainId: 421613,
      chainName: 'Arbitrum Goerli',
      isTestChain: true,
      isLocalChain: false,
      multicallAddress: '0x108B25170319f38DbED14cA9716C54E5D1FF4623',
      rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
      blockExplorerUrl: 'https://goerli-rollup-explorer.arbitrum.io',
      getExplorerAddressLink(hash: string) {
        return 'https://goerli-rollup-explorer.arbitrum.io/address/' + hash;
      },
      getExplorerTransactionLink(hash: string) {
        return 'https://goerli-rollup-explorer.arbitrum.io/tx/' + hash;
      },
    },
  ],
};

function Dapp({ children }: IProps) {
  return <DAppProvider config={config}>{children}</DAppProvider>;
}

export default Dapp;
