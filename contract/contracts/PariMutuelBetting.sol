// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PariMutuelBetting
 * @dev A smart contract for a simple pari-mutuel betting system
 */
contract PariMutuelBetting {
    address public owner; // Contract owner
    uint256 public totalPool; // Total amount of ETH in the betting pool
    bool public payoutFinalized; // Flag to check if payout has been finalized

    // Mapping to store user balances (ETH deposited for betting)
    mapping(address => uint256) public balances;

    // Events for logging contract activity
    event FundsDeposited(address indexed user, uint256 amount);
    event PayoutFinalized(uint8 winningOutcome);
    event Withdrawn(address indexed user, uint256 amount);

    // Modifier to restrict access to contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    /**
     * @dev Contract constructor - sets the deployer as the owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Allows users to deposit ETH into the betting pool
     * Emits a FundsDeposited event upon success
     */
    function depositFunds() external payable {
        require(msg.value > 0, "Must send ETH");
        
        // Update user balance and total pool
        balances[msg.sender] += msg.value;
        totalPool += msg.value;

        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Finalizes the payout and distributes winnings to winners
     * @param _outcome The winning outcome (1 or 2)
     * @param _winners Array of addresses of winning participants
     * @param _amounts Array of payout amounts corresponding to winners
     * Emits a PayoutFinalized event and Withdrawn event for each winner
     */
    function finalizePayout(uint8 _outcome, address[] calldata _winners, uint256[] calldata _amounts) external onlyOwner {
        require(!payoutFinalized, "Payout already finalized");
        require(_winners.length == _amounts.length, "Mismatched winners and amounts");

        payoutFinalized = true;
        emit PayoutFinalized(_outcome);

        // Loop through winners and transfer ETH to them
        for (uint256 i = 0; i < _winners.length; i++) {
            (bool success, ) = payable(_winners[i]).call{value: _amounts[i]}("");
            require(success, "Failed to send payout");
            
            emit Withdrawn(_winners[i], _amounts[i]);
        }
    }
}
