const DaiTokenMock = artifacts.require("DaiTokenMock");

module.exports = async function(deployer) {
  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed();
  // Mint 1.000 Dai Tokens for the deployer
  await tokenMock.mint(
      '0x00838f83fFc22C645423472AcE7Cd5E538211d5e',
      '1000000000000000000000'
  );
};