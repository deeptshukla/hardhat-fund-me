# hardhat-fund-me

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js


```

I will be adding the tasks and how to create this project from scratch.

```shell
yarn add --dev hardhat
yarn hardhat
```

This will create a basic hardhat project for you

Added the FundMe.sol and PriceConverter.sol to contracts.
Unlike remix, we have to add the chainlink interfaces.

```shell
yarn add --dev @chainlink/contracts
```