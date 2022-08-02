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

Instead of using deploy scripts, we will be using hardhat-deploy
```shell
yarn add --dev hardhat-deploy
```

To override hardhat-ethers with hardhat-deploy-ethers, we will run following. hardhat-deploy-ethers is a fork of hardhat-ethers. And since other packages might have a hardcoded dependency over hardhat-ethers, we are doing it this way.
```shell
yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```
When we run 
```shell
yarn hardhat deploy
```
it will run all the scripts inside the deploy folder.
In deploys, we don't need to create a function and then call it like we were doing earlier. hardhat-deploy will do it on its own.

The hardhat-deploy adds few more functionality to hre. For now we will be using the namedAccounts. We can name our accounts (like deployer) for every chain, and can use them in the tests.


We can use deploy function (https://github.com/wighawag/hardhat-deploy#deploymentsdeployname-options) to fill different fieds to deploy our contract