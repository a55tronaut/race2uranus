import { config } from "dotenv";

config();

export const TESTNET_DEPLOYER_PK = process.env.TESTNET_DEPLOYER_PK as string;
export const MAINNET_DEPLOYER_PK = process.env.MAINNET_DEPLOYER_PK as string;

export const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY as string;
