# Race2Uranus API

🚀 This repositery contains API source code for Race2Uranus game.

## Running the project

Install with `npm install`

Start development instance with `npm start`

Create production build with `npm run build`

### MongoDB

This project uses MongoDB for storage. You can start a local instance of mongo with docker by running `docker-compose -f mongo.yml up` or you can create an instance e.g. at [MongoDB Atlas](https://www.mongodb.com/atlas/database).

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name           | Type     | Default | Description                                                                                                              |
| -------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `LOG_LEVEL`    | `string` | info    | Standard npm log level                                                                                                   |
| `PORT`         | `number` | 3001    | Port at which the server should be listening                                                                             |
| `DB_URI`       | `string` |         | MongoDB URI                                                                                                              |
| `UI_URL`       | `string` |         | URL of Race2Uranus UI (to whitelist CORS requests)                                                                       |
| `CHAIN_ID`     | `number` |         | Arbitrum chain ID (`42161` = Arbitrum One, `421611` = Arbitrum Rinkeby)                                                  |
| `RPC_URL`      | `string` |         | RPC URL of the chain ([Arbitrum One](https://arb1.arbitrum.io/rpc), [Arbitrum Rinkeby](https://rinkeby.arbitrum.io/rpc)) |
| `GAME_ADDRESS` | `string` |         | Race2Uranus game Contract address                                                                                        |
| `SIGNER_PK`    | `string` |         | Signer private key. This is used to execute transactions that move the races forward in case no user does it.            |
