import { DAppProvider, Config } from '@usedapp/core';

import { CHAIN_ID, RPC_URL } from '../env';

interface IProps {
  children: React.ReactNode;
}

const config: Config = {
  autoConnect: true,
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: RPC_URL,
  },
  pollingInterval: 10000,
  refresh: 'never',
};

function Dapp({ children }: IProps) {
  return <DAppProvider config={config}>{children}</DAppProvider>;
}

export default Dapp;
