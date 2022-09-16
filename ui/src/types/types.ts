export interface IRocket {
  id: number;
  alt: string;
  imageSrc: string;
}

export interface ISupportedNft {
  id: number;
  name: string;
  img: string;
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
  earnings: number;
  wins: number;
  races: number;
}

export interface IRaceStatusMeta {
  waiting: boolean;
  inProgress: boolean;
  revealBlockReached: boolean;
  done: boolean;
}
