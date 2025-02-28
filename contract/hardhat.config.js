require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To load environment variables from a .env file

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26", // Updated to latest compatible version
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "", // Infura/Alchemy RPC URL
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // Array of private keys
      chainId: 11155111, // Sepolia chain ID
    },
  }
};