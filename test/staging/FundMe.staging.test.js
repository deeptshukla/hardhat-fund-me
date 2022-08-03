// const { assert } = require("chai")
// const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
// const { developmentChains } = require("../../helper-hardhat-config")

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("FundMe staging tests", () => {
//           let deployer
//           let fundMe
//           const sendValue = ethers.utils.parseEther("0.1")

//           beforeEach(async () => {
//               deployer = (await getNamedAccounts()).deployer
//               fundMe = await ethers.getContract("FundMe", deployer)
//               //   fundMe = await deployments.get("FundMe", deployer)
//               console.log(fundMe.address)
//               console.log(fundMe.getNumberOfFunders())
//           })
//           it("allows people to fund and withdraw", async () => {
//               await fundMe.fund({ value: sendValue })
//               await fundMe.withdraw()

//               const endingFundMeBalance = await fundMe.provider.getBalance(
//                   fundMe.address
//               )
//               console.log(
//                   `${endingFundMeBalance} should equal 0, running assert equal...`
//               )
//               assert.equal(endingFundMeBalance.toString(), "0")
//           })
//       })

const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw({
                  gasLimit: 100000,
              })
              //   await txn.wait(6)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
