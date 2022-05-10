const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory(
    "Verification"
  );
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);
  const domainContractFactory2 = await hre.ethers.getContractFactory("NFT");
  const domainContract2 = await domainContractFactory2.deploy();
  await domainContract2.deployed();

  console.log("Contract deployed to:", domainContract2.address);

  txn = await domainContract2.signMessage("test");
  await txn.wait();

  const address = await domainContract2.getSigner("test");
  console.log("Owner of message", address);
  // const messageHash = ethers.utils.sha256(
  //   ethers.utils.defaultAbiCoder.encode(
  //     ["address", "string"],
  //     ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", "testeeeee"]
  //   )
  // );
  // let messageHashBytes = ethers.utils.arrayify(messageHash);
  // const hashed = hre.ethers.utils.keccak256(
  //   ethers.utils.toUtf8Bytes(JSON.stringify("testtt"))
  // );
  // const messageHashBytes = hre.ethers.utils.arrayify(hashed);

  const messageHash = ethers.utils.sha256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string"],
      ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", "testtt"]
    )
  );
  let messageHashBytes = ethers.utils.arrayify(messageHash);
  console.log(messageHashBytes, "messagehash");
  txn = await domainContract2.mintNFT(
    "testtt",
    messageHashBytes,
    0x0d193c84a0901a46b981d1eab69cbee0f89a117631494ca68815bc3d6ef1d0b62a83f87c58bbe81eac44b80859d4af26000f0beb6007bd84e5ab23073339b2ff1c,
    domainContract.address
  );
  await txn.wait();
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
