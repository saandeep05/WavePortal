require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-toolbox")

require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
