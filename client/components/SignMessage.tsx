import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";

import NFT from "../utils/NFT.json";

declare let window: any;

const signMessage = async (props: { event: () => void; message: string }) => {
  const { message, event } = props;

  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const address = await signer.getAddress();
    const messageHash = ethers.utils.sha256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "string"],
        [address, message]
      )
    );
    let hashedMessage = ethers.utils.arrayify(messageHash);
    const signature = await signer.signMessage(hashedMessage);
    console.log(ethers.utils.verifyMessage(hashedMessage, signature));
    let nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
    let txn = await nftContract.mintNFT(message, hashedMessage, signature);
    nftContract.on("NFTMinted", event);

    await txn.wait();
    return {
      message,
      signature,
      address,
      hashedMessage,
    };
  } catch (err) {
    console.error(err);
  }
};
interface INFTInfo {
  owner: string;
  tokenUri: string;
}
export default function SignMessage(props: { currentAccount: string }) {
  const [nftList, setNFTList] = useState<INFTInfo[]>([]);
  const [messageTyped, setMessageTyped] = useState("");
  const nftMinted = () => {
    alert("NFT MINTED");
    fetchNFTs();
  };

  const handleSign = async (e: any) => {
    e.preventDefault();

    if (messageTyped)
      signMessage({
        event: nftMinted,
        message: messageTyped,
      });
  };
  const fetchNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, signer);
    let allNFTs = await nftContract.fetchNFTs();

    const itemsFiltered = allNFTs.filter((i: any) => i.tokenUri.length > 5);

    const items = await Promise.all(
      itemsFiltered.map(async (i: INFTInfo) => {
        let item = {
          owner: i.owner,
          tokenUri: i.tokenUri,
        };

        return item;
      })
    );

    setNFTList(items);
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <>
      <form className="m-4" onSubmit={handleSign}>
        <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Sign messages
            </h1>
            <div className="">
              <div className="my-3">
                <textarea
                  required
                  name="message"
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="Message"
                  onChange={(e) => setMessageTyped(e.target.value)}
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Sign message
            </button>
          </footer>
        </div>
      </form>
      {true && (
        <>
          <h1 className="text-red-600 mb-4">
            You can copy and paste in your browser to see the object and after
            that get the image string and paste in your browser to see the image
          </h1>
          {nftList.map((nft) => (
            <>
              <div className="textarea w-full h-full textarea-bordered mb-4 ">
                <h1 className="text-teal-500">Owner: {nft.owner}</h1>
                <h1>NFT DATA:</h1>
                <h3 className="break-all	 w-full mb-20">{nft.tokenUri}</h3>
              </div>
            </>
          ))}
        </>
      )}
    </>
  );
}
