# Race2Uranus UI

🚀 This repositery contains UI source code for Race2Uranus

## Running the project

Install with `npm install`

Start development instance with `npm start`

Create production build with `npm run build`

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name                        | Type     | Default | Description                                                                                                                                                                                                                                                                                             |
| --------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_CHAIN_ID`        | `number` |         | Arbitrum chain ID (`42161` = Mainnet, `421611` = Rinkeby testnet)                                                                                                                                                                                                                                       |
| `REACT_APP_RPC_URL`         | `string` |         | URL of the chain( [`Mainnet`](https://arb1.arbitrum.io/rpc), [`Rinkeby testnet`](https://rinkeby.arbitrum.io/rpc) )                                                                                                                                                                                     |
| `REACT_APP_GAME_ADDRESS`    | `string` |         | Race2Uranus game Contract address                                                                                                                                                                                                                                                                       |
| `REACT_APP_MAGIC_ADDRESS`   | `string` |         | Magic Token contract address                                                                                                                                                                                                                                                                            |
| `REACT_APP_NFT_META_URL`    | `string` |         | API that returns NFT metadata                                                                                                                                                                                                                                                                           |
| `REACT_APP_NFT_MAPPINGS`    | `string` |         | remap NFT A to NFT B so that A is treated as B when fetching metadata, useful for testing purposes. Example: "0xABC:0xDEF" the adress ABC will map to DEF so that testing contract will act like the main one. You might want use this to get NFT images from the real contract by using test contract. |
| `REACT_APP_HEAP_PROJECT_ID` | `string` |         | Heap ID to have page analytics                                                                                                                                                                                                                                                                          |
| `REACT_APP_API_URL`         | `string` |         | Race2Uranus API URL                                                                                                                                                                                                                                                                                     |
|                             |
