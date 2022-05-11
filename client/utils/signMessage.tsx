import { ethers } from "ethers";

import { mintNFT } from "./mintNFT";

export const signMessage = async (props: {
  event: () => void;
  message: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { message, event, setLoading } = props;

  try {
    setLoading(true);
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
    //minting NFT
    const loading = await mintNFT({ message, hashedMessage, signature, event });
    setLoading(loading);
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
