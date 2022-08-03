const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMeMe", function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async function () {
        // We can also get the last added contract using deployments as well
        // let addressFromDeployments = await deployments.get("FundMe")
        // console.log(addressFromDeployments.address)
        // const accounts = await ethers.getSigners()
        // console.log(accounts)
        // for (let index = 0; index < accounts.length; index++) {
        //     const element = accounts[index]["address"]
        //     console.log(element)
        // }
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", function () {
        it("sets the aggregator address correctly", async function () {
            const response = await fundMe.getPriceFeed()
            console.log(`response: ${response}`)
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", function () {
        it("Fails if you don't send enough ETH", async () => {
            // await expect(fundMe.fund()).to.be.reverted
            // await expect(fundMe.fund()).to.be.revertedWith(
            //     "You need to spend more ETH!"
            // )
            await expect(fundMe.fund()).to.be.revertedWithCustomError(
                fundMe,
                "FundMe__LessEthSent"
            )
        })

        it("Updates the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Add funders to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.getFunder(0)
            console.log(funder)
            assert.equal(funder, deployer)
            console.log("funder is in fund")
            fundersCount = await fundMe.getNumberOfFunders()
            console.log(`${fundersCount}`)
        })
    })
    describe("withdraw", () => {
        //Add beforeEach to fund the contract
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withfraw ETH from a single funder", async () => {
            //Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // Act

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const gasPrice = transactionReceipt["effectiveGasPrice"]
            const gasUsed = transactionReceipt["gasUsed"]
            const gasCost = gasPrice.mul(gasUsed)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("withfraw ETH from a multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for (let index = 0; index < 6; index++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[index]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const gasCost = transactionReceipt["effectiveGasPrice"].mul(
                transactionReceipt["gasUsed"]
            )
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost)
            )
            assert.equal(endingFundMeBalance.toString(), "0")

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let index = 0; index < 6; index++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(
                        accounts[index].address
                    ),
                    0
                )
            }
        })

        it("Cheaper withfraw ETH from a multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for (let index = 0; index < 6; index++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[index]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const gasCost = transactionReceipt["effectiveGasPrice"].mul(
                transactionReceipt["gasUsed"]
            )
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost)
            )
            assert.equal(endingFundMeBalance.toString(), "0")

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let index = 0; index < 6; index++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(
                        accounts[index].address
                    ),
                    0
                )
            }
        })

        it("Only  allows owner to withdraw", async () => {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(accounts[2])
            //Doesn't work. Has something changed?
            // await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
            //     "FundMe__NotOwner"
            // )

            // This works, but not sure why the above doesn't, when it is mentioned in the documentation itself.
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(
                fundMeConnectedContract,
                "FundMe__NotOwner"
            )
        })
    })
})
