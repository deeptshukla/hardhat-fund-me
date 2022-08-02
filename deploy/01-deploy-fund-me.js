// const { network } = require("hardhat")

function deployFunc(params) {
    console.log("Hey from deployFunc")
}

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(`Hey from deployFunc being exported chainId: ${chainId} `)
}
