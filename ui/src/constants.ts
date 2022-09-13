import { MetaMaskInpageProvider } from '@metamask/providers';
import { ISupportedNft } from './types';

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

export const GAME_LOOP_INTERVAL_SECONDS = 7;

export const supportedNfts: ISupportedNft[] = [
  {
    id: 0,
    name: 'Smol Brains',
    href: 'https://trove.treasure.lol/images/fetch/f_auto,c_limit,w_640,q_auto/https://djmahssgw62sw.cloudfront.net/0/SmolBrains.png',
    url: 'https://trove.treasure.lol/collection/smol-brains',
    address: '0x6325439389E0797Ab35752B4F43a14C004f22A9c',
  },
  {
    id: 1,
    name: 'BattleFly',
    href: 'https://trove.treasure.lol/images/fetch/f_auto,c_limit,w_640,q_auto/https://djmahssgw62sw.cloudfront.net/0/Thumbnail-BF-Founder1.jpg',
    url: 'https://trove.treasure.lol/collection/battlefly',
    address: '0x0aF85A5624D24E2C6e7Af3c0a0b102a28E36CeA3',
  },
  {
    id: 2,
    name: 'Legion Auxiliary',
    href: 'https://trove.treasure.lol/images/fetch/f_auto,c_limit,w_640,q_auto/https://djmahssgw62sw.cloudfront.net/0/AuxiliaryThumbnail.png',
    url: 'https://trove.treasure.lol/collection/legion-auxiliary',
    address: '0xfE8c1ac365bA6780AEc5a985D989b327C27670A1',
  },
  {
    id: 3,
    name: 'Smol Bodies',
    href: 'https://trove.treasure.lol/images/fetch/f_auto,c_limit,w_640,q_auto/https://djmahssgw62sw.cloudfront.net/0/SmolBodiesThumbnail.png',
    url: 'https://trove.treasure.lol/collection/smol-bodies',
    address: '0x17DaCAD7975960833f374622fad08b90Ed67D1B5',
  },
  {
    id: 4,
    name: 'Toadstoolz',
    href: 'https://trove.treasure.lol/images/fetch/f_auto,c_limit,w_640,q_auto/https://djmahssgw62sw.cloudfront.net/0/toadstoolz_hero.webp',
    url: 'https://trove.treasure.lol/collection/toadstoolz',
    address: '0x09CAE384C6626102ABE47Ff50588A1dBe8432174',
  },
  {
    id: 5,
    name: 'The Lost Donkeys',
    href: 'https://trove.treasure.lol/images/fetch/f_auto,c_limit,w_640,q_auto/https://djmahssgw62sw.cloudfront.net/0/the_lost_donkeys_hero.webp',
    url: 'https://trove.treasure.lol/collection/the-lost-donkeys',
    address: '0x5e84c1A06E6AD1a8ED66Bc48dBe5eB06BF2Fe4aA',
  },
];
