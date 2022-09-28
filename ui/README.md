# Race2Uranus UI

🚀 This repositery contains UI source code for the Race2Uranus game.

## Running the project

Install with `npm install`

Start development instance with `npm start`

Create production build with `npm run build`

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name                        | Type     | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `REACT_APP_CHAIN_ID`        | `number` |         | Arbitrum chain ID (`42161` = Arbitrum One, `421611` = Arbitrum Rinkeby)                                                                                                                                                                                                                                                                                                                                                        |
| `REACT_APP_RPC_URL`         | `string` |         | RPC URL of the chain ([`Arbitrum One`](https://arb1.arbitrum.io/rpc), [`Arbitrum Rinkeby`](https://rinkeby.arbitrum.io/rpc))                                                                                                                                                                                                                                                                                                   |
| `REACT_APP_L1_CHAIN_ID`     | `number` |         | ID of the L1 chain (e.g. for Arbitrum One the L1 is Ethereum so the ID will be `1`)                                                                                                                                                                                                                                                                                                                                            |
| `REACT_APP_L1_RPC_URL`      | `string` |         | RPC URL of the L1 chain                                                                                                                                                                                                                                                                                                                                                                                                        |
| `REACT_APP_GAME_ADDRESS`    | `string` |         | Race2Uranus game Contract address                                                                                                                                                                                                                                                                                                                                                                                              |
| `REACT_APP_MAGIC_ADDRESS`   | `string` |         | $MAGIC Token contract address                                                                                                                                                                                                                                                                                                                                                                                                  |
| `REACT_APP_NFT_META_URL`    | `string` |         | API that returns NFT metadata                                                                                                                                                                                                                                                                                                                                                                                                  |
| `REACT_APP_NFT_MAPPINGS`    | `string` |         | Maps NFT A to NFT B so that A is treated as B. This is very useful for testing purposes. That way a testnet contract address can be mapped to the mainnet one before e.g. fetching metadata. This should be a comma-separated list in the following format: `<label>:<address_from>:<address_to>`. The `<label>` is just for easy visual identification of what the addresses are referring to and can be an arbitrary string. |
| `REACT_APP_HEAP_PROJECT_ID` | `string` |         | Heap analytics project ID                                                                                                                                                                                                                                                                                                                                                                                                      |
| `REACT_APP_API_URL`         | `string` |         | Race2Uranus API URL                                                                                                                                                                                                                                                                                                                                                                                                            |
|                             |
