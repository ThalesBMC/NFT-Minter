const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("NFT");
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  txn = await domainContract.signMessage("test");
  await txn.wait();

  const address = await domainContract.getSigner("test");
  console.log("Owner of message", address);
  const messageHash = ethers.utils.sha256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string"],
      ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", "testtt"]
    )
  );
  let messageHashBytes = ethers.utils.arrayify(messageHash);
  console.log(messageHashBytes, "messagehash");
  const signature =
    "0xe238f65e99eea26faaa243785dc63b8c9d6abcde497fc5d00a3a541079abd5c05bb1a0a13db790d206ca38a32c3e191b21e4ee76ba4395019a80acb5c0feb6cb1b";
  console.log(ethers.utils.verifyMessage(messageHashBytes, signature));
  txn = await domainContract.mintNFT("testtt", messageHashBytes, signature);

  await txn.wait();
  const value = await domainContract.getNFTHolder();
  console.log("tokenuri", value);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
