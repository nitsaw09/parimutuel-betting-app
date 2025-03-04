const ethers = require('ethers');
const contractABI = require('../abis/PariMutuelBetting.json'); 
const DepositModel = require('../../models/deposit');
const RoundModel = require('../../models/round');   

const provider = new ethers.JsonRpcProvider(process.env.INFURA_ENDPOINT);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);

// contract event FundsDeposited(address user, uint256 amount);
contract.on("FundsDeposited", async (user, amount) => { 
    console.log("FundsDeposited", user, ethers.formatEther(amount));
    await DepositModel.updateOne(
        { walletAddress: user }, // Filter by wallet address
        { $inc: { amount: Number(ethers.formatEther(amount)) } }, // Increment the amount
        { upsert: true } // Create if not exists
    );
});

// contract event Withdrawn(address winner, uint256 amount);
contract.on("Withdrawn", async (winner, amount) => { 
    console.log("Withdrawn", winner, amount);
    await RoundModel.updateOne(
        { walletAddress: user }, // Filter by wallet address
        { $set: { status: 'finalized' } }, // Increment the amount
    );
});
