import React, { useState, useEffect } from "react";
declare let window: any;
export const useWallet = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== "3") {
          alert("Please connect to Ropsten!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentAccount) {
      checkNetwork();
    }
  }, [currentAccount]);
  const disconnect = () => {
    setCurrentAccount("");
  };
  return { currentAccount, disconnect, connectWalletAction };
};
