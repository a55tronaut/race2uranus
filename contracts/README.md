# Race2Uranus contracts

🚀 This repository contains Contract source code for the Race2Uranus game.

## Installation

Run `npm install`

## Available scripts

For convenience, there's a number of predefined scripts in `package.json`:

- `npm test` - run the full automated test suite
- `npm run compile` - compile all contracts
- `npm run estimateGas` - estimate how much it would cost to deploy the contracts
- `npm run deploy:<network_name>` - deploy to the specified network.See `networks` section in `hardhat.config.ts` for a list of valid network names. For example `npm run deploy:arbrin` deploys the contracts to arbitrum rinkeby.
- `npm run verify:<network_name>` - [verify](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan) contract source code on the specified network's explorer. For example `npm run verify:arb` verifies the contract on arbitrum mainnet. If that doesn't work, then you might need to run this command: `npx hardhat verify <proxy_address> --network arbrin` where `<proxy_address>` is the proxy address of the Race2Uranus contract.
- `npm run setTimeParams -- --network <network_name>` - set the time params of the Race2Uranus contract. See `scripts/setTimeParams.ts` for details.
- `npm run setRaceConfig -- --network <network_name>` - set the race params of the Race2Uranus contract. See `scripts/setRaceConfig.ts` for details.
- `npm run sendTestTokens -- --network <network_name>` - send some test tokens (MAGIC and NFTs) to a given address. This is great for testing purposes.

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name                  | Type     | Default | Description                                                     |
| --------------------- | -------- | ------- | --------------------------------------------------------------- |
| `TESTNET_DEPLOYER_PK` | `string` |         | Private key used to deploy the contract to testnet              |
| `MAINNET_DEPLOYER_PK` | `string` |         | Private key used to deploy the contract to mainnet              |
| `ARBISCAN_API_KEY`    | `string` |         | Arbiscan Developer API KEY used to submit code for verification |
