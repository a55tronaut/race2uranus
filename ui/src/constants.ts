import { MetaMaskInpageProvider } from '@metamask/providers';

// matches Antd https://ant.design/components/grid/#Col
export const SCREEN_BREAKPOINT = Object.freeze({
  XXL: 1600,
  XL: 1200,
  LG: 992,
  MD: 768,
  SM: 576,
});

export const SECOND_MILLIS = 1000;
export const MINUTE_MILLIS = 60 * SECOND_MILLIS;

export const MAINNET_CHAIN_ID = 42161;

export const ethereum = (window as any).ethereum as MetaMaskInpageProvider;

export const ETH_ADDRESS = 'eth';

export const MAGIC_ADDRESS = '0x539bdE0d7Dbd336b79148AA742883198BBF60342';
export const MAGIC_DECIMAL_UNIT = 'ether';

export const raceTotalDur = 10;
export const raceLeftDur = 10;
export const countDownSeconds = 5;

export const isRaceStarted = true;

export const totalRockets = 8;
export const finalStanding = [1, 3, 10, 6, 4, 5, 8, 2, 9, 7];

export const maxHeight = 100;
export const minHeight = 50;

export const rocketsType = 1;
export const assetType = ['monoRockets', 'polyRockets', 'monoSpaceShip', 'polySpaceShip'];
export const path = 'assets/' + assetType[rocketsType];
