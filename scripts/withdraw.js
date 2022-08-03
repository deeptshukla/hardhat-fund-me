const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    // const fundMe = await ethers.getContract("FundMe", deployer)
    const fundMe = await ethers.getContract("FundMe")

    console.log("Starting balance of contract is ")
    let balance = await ethers.provider.getBalance(fundMe.address)
    console.log(`${balance}`)
    console.log("Starting balance of deployer is ")
    let deployerBalance = await ethers.provider.getBalance(deployer)
    console.log(`${deployerBalance}`)

    const txnResponse = await fundMe.withdraw()
    const txnReceipt = await txnResponse.wait(1)
    console.log("Got the money back")
    console.log("Now balance of contract is ")
    balance = await ethers.provider.getBalance(fundMe.address)
    console.log(`${balance}`)
    console.log("Now balance of deployer is ")
    deployerBalance = await ethers.provider.getBalance(deployer)
    console.log(`${deployerBalance}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
