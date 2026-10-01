"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Props {
  nftAddress: string;
  tokenId: bigint;
}

export const NFTList = ({ nftAddress, tokenId }: Props) => {
  const [price, setPrice] = useState("");
  const { writeContractAsync: listNft } = useScaffoldWriteContract("NFTStore");

  const handleList = async () => {
    if (!price) return;
    try {
      await listNft({
        functionName: "list",
        args: [nftAddress, tokenId, BigInt(price)],
      });
      setPrice("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Цена в wei"
        className="input input-bordered input-sm"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <button className="btn btn-sm btn-secondary" onClick={handleList} disabled={!price}>
        Выставить
      </button>
    </div>
  );
};


