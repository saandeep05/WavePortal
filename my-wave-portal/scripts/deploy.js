const { ethers } = require("hardhat")

const main = async() => {
    const [deployer] = await hre.ethers.getSigners();
    let accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Account deployed to: ", waveContract.address);

}

const runMain = async() => {
    try {
        await main();
        process.exit(0)
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();