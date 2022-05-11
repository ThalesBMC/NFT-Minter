import React from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";

import NFT from "../utils/NFT.json";

interface IMint {
  message: string;
  hashedMessage: Uint8Array;
  signature: string;
  event: () => void;
}
export const mintNFT = async (props: IMint) => {
  const { message, hashedMessage, signature, event } = props;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
  nftContract.on("NFTMinted", event);
  let txn = await nftContract.mintNFT(message, hashedMessage, signature);
  await txn.wait();
  return false;
};
