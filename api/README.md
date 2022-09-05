# Race2Uranus API

🚀 This repositery contains API source code for Race2Uranus game.

## Running the project

Install with `npm install`

Start development instance with `npm start`

Create production build with `npm run build`

### MongoDB

This project uses MongoDB for storage.

Start MongoDB instance using

`docker-compose -f mongo.yml up`

or any other instance compatible with `mongodb://root:example@localhost:27017` connection string.


## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name                        | Type     | Default                                    | Description                                                                                                 |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `LOG_LEVEL`        | `string` | info | Standard npm log level |
| `PORT`        | `number` | 3001  | Port at which the server should be listening |
| `REACT_APP_RPC_URL`         | `string` |                                            | URL of the chain (https://arb1.arbitrum.io/rpc = mainnet, https://rinkeby.arbitrum.io/rpc = Rinkeby testnet) |
| `DB_URI`    | `string` |  | MongoDB URI                                                                       |
| `UI_URL`   | `string` |                                            | URL of Race2Uranus UI (to whitelist CORS requests)
| `CHAIN_ID`    | `number` |                                            | Arbitrum chain ID (`42161` = mainnet, `421611` = Rinkeby testnet)                                                           |
| `RPC_URL`    | `string` |                                            | URL of the chain    (https://arb1.arbitrum.io/rpc = mainnet, https://rinkeby.arbitrum.io/rpc = Rinkeby testnet) |         |
| `GAME_ADDRESS` | `string` |                                          | Race2Uranus game Contract address                                                                        |
| `SIGNER_PK`         | `string` |                                            |	Signer private key.                                                                                             |

