export interface IDummy {}

export interface IRocket {
  id: number;
  alt: string;
  imageSrc: string;
}

export interface INftLeaderboardResult {
  position: number;
  address: string;
  nftId: string;
  owner: string;
  winnings: number;
  races: number;
}
