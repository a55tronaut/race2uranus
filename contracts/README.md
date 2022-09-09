# Race2Uranus contracts

🚀 This repository contains Contract source code for Race2Uranus game.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Installation

Run `npm install`

## Scripts

- **Run Tests for the project:** `npm test`
- **Compile project:** `npm run compile`
- **Estimate deployment cost:** `npm run estimateGas`
- **Deploy the contract:** `npm run deploy:<network_name>`, see `networks` section in `hardhat.config.ts` for a list of valid network names. Example `npm run deploy:arbrin` deploys the contract to arbitrum rinkeby.
- **[To verify](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan) the contract on a given network:** `npm run verify:<network_name>`. Example `npm run verify:arb` verifies the contract in arbitrum mainnet.
- **To update time parameters of the contract:** `npm run setTimeParams`see `setTimeParams` section in `scripts/setTimeParams.ts`. Example you can change `blockTimeMillis` in `setTimeParams` file and then run `npm run setTimeParams` to update blockTime (in milliseconds) parameter of the race.
- **To update race parameters of the contract:** `npm run setRaceConfig` see `setRaceConfig` section in `scripts/setRaceConfig.ts`. Example you can change `maxRockets` in `setRaceConfig` file and then run `npm run setRaceConfig` to update maxRocket parameter of the race.
- //: **Commnet to explain how to pass network variable** `--network <name>` into scripts. For example, you can verifiy the contract on arbitrum mainnet, `npm run verify:arb` The network names and their networks are, arbrin: Arbitrum Rinkeby testnet, goerli: Arbitrum Goerli testnet, arb:Arbitrum Mainnet

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, a `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name                  | Type     | Default | Description                                                     |
| --------------------- | -------- | ------- | --------------------------------------------------------------- |
| `TESTNET_DEPLOYER_PK` | `string` |         | Private key used to deploy the contract to testnet              |
| `MAINNET_DEPLOYER_PK` | `string` |         | Private key used to deploy the contract to mainnet              |
| `ARBISCAN_API_KEY`    | `string` |         | Arbitrum Developer API KEY used to submit code for verification |

## Contract verification

`npx hardhat verify <proxy_address> --network arbrin`
