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
- `npm run setTimeParams -- --network <network_name>` - set the time params of the Race2Uranus contract. See `scripts/setTimeParams.ts` for details.
- `npm run setRaceConfig -- --network <network_name>` - set the race params of the Race2Uranus contract. See `scripts/setRaceConfig.ts` for details.
- `npm run sendTestTokens -- --network <network_name>` - send some test tokens (MAGIC and NFTs) to a given address. This is great for testing purposes.
- `npm run createFirstRace -- --network <network_name>` - creates a race if none exist. By default the contract is deployed without any active races to give you a chance to perform final checks and adjust parameters if needed before kicking off the first race.

## Contract [verification](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan)

The contracts should be automatically verified during the deployment process. However, manual steps are described below in case there is an error.

To verify contract source code on the specified network's explorer, you need to run `npx hardhat verify <contract_address> --network <network_name>`. Depending on the contract, some additional parameters might be required, as documented below.

To verify `Race2Uranus.sol` you need to provide its [proxy address](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable) (not implementation address). You don't need to provide constructor args - they will be automatically detected.
Depending on the explorer, the proxy verification might fail, e.g. on [BlockScout](https://forum.openzeppelin.com/t/verify-hardhat-upgradeable-proxy-on-blockscout/15436) which is used by [Arbitrum Goerli](https://goerli-rollup-explorer.arbitrum.io/).

So the command to verify `Race2Uranus.sol` will be e.g. `npx hardhat verify 0xC167C8c53bb248158B9AAAAb442fCBAf413d87fe --network arbrin`.

To verify other contracts in this project, you need to specify the source file and constructor arguments that were used to deploy them.

For MAGIC, the example command would be `npx hardhat verify --network arbgor --contract contracts/SimpleToken.sol:SimpleToken 0x46beCf6735d3ef798307035AD91cb709970bF321 MAGIC MAGIC 100000000000000000000000000`.

For SMOL, the example command would be `npx hardhat verify --network arbgor --contract contracts/SimpleNft.sol:SimpleNft 0x0CDd4aB6A82D8B4EFcAB7EeE8F6722b20df61592 SmolBrains SMOL`.

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
