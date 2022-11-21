const { Contract } = require("ethers");
const { run } = require("hardhat");

const main = async() => {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("WavePortal deployed at: ", waveContract.address);
    console.log("Owner address: ", owner.address);

    let waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave("This is test tweet 1");
    waveTxn = await waveContract.setUsername("Saandeep");
    // testing award functionality
    let ownerBalance = await owner.getBalance();
    console.log("Before award:", ownerBalance.toString());
    waveTxn = await waveContract.award("0x0Dffc612a4Faf7FC3144B61c66E756EFB4784d8B", {value: ethers.utils.parseEther("1").toString()});
    ownerBalance = await owner.getBalance();
    console.log("After award:", ownerBalance.toString());
    await waveTxn.wait();

    waveTxn = await waveContract.connect(user1).wave("This is test tweet 2");
    await waveTxn.wait();

    waveTxn = await waveContract.connect(user2).wave("This is test tweet 3");
    // waveTxn = await waveContract.connect(user2).setUsername("Saandeep");
    waveTxn = await waveContract.connect(user2).setUsername("Saandeep05");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    let i=0;
    while(i<waveCount) {
        let waveInfo = await waveContract.getWaveInfo(i);
        console.log(waveInfo.tweet, "by", waveInfo.account, "at", waveInfo.timestamp.toNumber());

        let txn = await waveContract.getUsername(waveInfo.account);
        if(txn !== "")
            console.log("username:", txn);
        else
            console.log("username: anonymous");
        i++;
    }

    // let userWaveCount = await waveContract.connect(user1).getWaveCount(owner.address);
    // await userWaveCount.wait();
};

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();