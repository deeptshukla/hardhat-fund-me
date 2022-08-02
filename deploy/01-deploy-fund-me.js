const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
function deployFunc(params) {
    console.log("Hey from deployFunc")
}

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const allDeployers = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(`Hey from deployFunc being exported chainId: ${chainId} `)
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ehtUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ehtUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    })
    log("---------------------------------------")
}

module.exports.tags = ["all", "fundme"]
