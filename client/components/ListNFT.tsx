import React from "react";
import { INFTInfo } from "../types/INFTInfo";

//shows the loading indicator and all NFTs from the nftList
export const ListNFT = (props: { nftList: INFTInfo[]; loading: boolean }) => {
  const { nftList, loading } = props;
  return (
    <div className="w-full p-8">
      <h1 className="text-red-600 mb-4">
        You can copy and paste in your browser to see the object and after that
        get the image string and paste in your browser to see the image
      </h1>

      {loading && (
        <>
          <div className="flex items-center justify-center ">
            <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          </div>
        </>
      )}
      {nftList.map((nft: INFTInfo) => (
        <>
          <div className="textarea w-full h-full textarea-bordered mb-4 ">
            <h1 className="text-teal-500">Owner: {nft.owner}</h1>
            <h1>NFT DATA:</h1>
            <h3 className="break-all	 w-full mb-20">{nft.tokenUri}</h3>
          </div>
        </>
      ))}
    </div>
  );
};
