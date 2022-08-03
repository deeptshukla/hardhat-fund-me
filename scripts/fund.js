const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(deployer)
    console.log("Funding contract...")
    transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    })
    await transactionResponse.wait(1)
    console.log("Funded with balance")
    let balance = await ethers.provider.getBalance(fundMe.address)
    console.log(`${balance}`)

    let deployerBalance = await ethers.provider.getBalance(deployer)
    console.log(`${deployerBalance}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
