import { useCallback, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { Chain, useConfig, useEthers } from '@usedapp/core';
import styled, { CSSProperties } from 'styled-components';

import { CHAIN_ID } from '../env';
import { orange } from '../colors';
import Logo from './Logo';

const maskStyle: CSSProperties = {
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(0,0,0,0.6)',
};

function WalletConnector() {
  const { account, activateBrowserWallet, switchNetwork, chainId } = useEthers();
  const { networks } = useConfig();
  const accountConnected = !!account;
  const isCorrectChain = chainId === CHAIN_ID;
  const showModal = !accountConnected || !isCorrectChain;
  const { chainName } = networks?.find((n) => n.chainId === CHAIN_ID) || ({} as Chain);

  const changeNetwork = useCallback(() => {
    switchNetwork(CHAIN_ID);
  }, [switchNetwork]);

  useEffect(() => {
    if (accountConnected && !isCorrectChain) {
      changeNetwork();
    }
  }, [accountConnected, changeNetwork, isCorrectChain]);

  return (
    <Modal
      centered
      open={showModal}
      closable={false}
      maskStyle={maskStyle}
      style={{ border: 'none' }}
      modalRender={() => (
        <ModalContent>
          <Logo className="logo" />
          <Button onClick={accountConnected ? changeNetwork : activateBrowserWallet}>
            {accountConnected ? (
              <span>
                Switch network to <span className="orange">{chainName}</span> to get started
              </span>
            ) : (
              'Connect your wallet to begin'
            )}
          </Button>
        </ModalContent>
      )}
    />
  );
}

const ModalContent = styled.div`
  z-index: 1001;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;

  .logo {
    height: 100px;
    margin-bottom: 32px;
  }

  .orange {
    color: ${orange};
  }
`;

export default WalletConnector;
