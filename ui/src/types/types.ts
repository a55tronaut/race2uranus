export interface IDummy {}

export interface IRocket {
  id: number;
  alt: string;
  imageSrc: string;
}

export interface INftList {
  id: number;
  title: string;
  href: string;
  url: string;
  address: string;
}

export interface IUserWlNfts {
  address: string;
  contractName: string;
  id: string;
  display?: boolean;
}

export interface INftLeaderboardResult {
  position: number;
  address: string;
  nftId: string;
  owner: string;
  winnings: number;
  races: number;
}
