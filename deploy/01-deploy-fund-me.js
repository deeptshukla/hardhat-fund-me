// const { network } = require("hardhat")

const { from } = require("form-data")

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
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: ["0x8a753747a1fa494ec906ce90e9f37563a8af630e"],
        log: true,
    })
}
