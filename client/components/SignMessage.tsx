import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";

declare let window: any;
const signMessage = async (props: { message: string }) => {
  const { message } = props;
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // const messageHash = ethers.utils.sha256(
    //   ethers.utils.defaultAbiCoder.encode(
    //     ["address", "string"],
    //     ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", message]
    //   )
    // );
    // let messageHashBytes = ethers.utils.arrayify(messageHash);
    // const hashedMessage = ethers.utils.solidityKeccak256(["string"], [message]);
    // const signature = await window.ethereum.request({
    //   method: "personal_sign",
    //   params: [hashedMessage, accounts[0]],
    // });
    // const hashed = ethers.utils.keccak256(
    //   ethers.utils.toUtf8Bytes(JSON.stringify(message))
    // );
    // const hashedMessage = Web3.utils.sha3(message);
    // const signature = await window.ethereum.request({
    //   method: "personal_sign",
    //   params: [hashedMessage, accounts[0]],
    // });
    // const hashedMessage = ethers.utils.arrayify(hashed);
    const messageHash = ethers.utils.sha256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "string"],
        ["0x94C34FB5025e054B24398220CBDaBE901bd8eE5e", "testtt"]
      )
    );
    let hashedMessage = ethers.utils.arrayify(messageHash);
    const signature = await signer.signMessage(hashedMessage);
    console.log(ethers.utils.verifyMessage("testtt", signature));
    const address = await signer.getAddress();

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

export default function SignMessage() {
  const resultBox = useRef();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();

  const handleSign = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const sig = await signMessage({
      setError,
      message: data.get("message"),
    });
    if (sig) {
      setSignatures([...signatures, sig]);
    }
  };
  useEffect(() => {
    console.log(signatures);
  }, [signatures]);
  return (
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
                type="text"
                name="message"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Message"
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
  );
}
