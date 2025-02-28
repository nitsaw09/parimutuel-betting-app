const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PariMutuelBettingModule", (m) => {
  const pariMutuelBetting = m.contract("PariMutuelBetting");

  return { pariMutuelBetting };
});
