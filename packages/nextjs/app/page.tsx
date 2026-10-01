"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [uri, setUri] = useState("");
  const [status, setStatus] = useState("");

  const { data: listings } = useScaffoldReadContract({
    contractName: "NFTStore",
    functionName: "getAllListings",
  });

  const { writeContractAsync: mintNft } = useScaffoldWriteContract("YourNFT");
  const { writeContractAsync: buyNft } = useScaffoldWriteContract("NFTStore");

  const handleMint = async () => {
    if (!uri) return;
    try {
      setStatus("Создаём NFT...");
      await mintNft({ functionName: "mint", args: [uri] });
      setUri("");
      setStatus("NFT создан!");
    } catch (e) {
      console.error(e);
      setStatus("Ошибка при создании");
    }
  };

  const handleBuy = async (listingId: bigint, price: bigint) => {
    try {
      setStatus("Покупаем...");
      await buyNft({ functionName: "buy", args: [listingId], value: price });
      setStatus("Куплено!");
    } catch (e) {
      console.error(e);
      setStatus("Ошибка при покупке");
    }
  };

  return (
    <div className="flex flex-col items-center flex-grow pt-10 px-4">
      <h1 className="text-4xl font-bold mb-2">NFT Store</h1>
      <p className="opacity-70 mb-8">Создавайте и покупайте NFT</p>

      <div className="card bg-base-100 shadow-xl w-full max-w-2xl mb-8">
        <div className="card-body">
          <h2 className="card-title">Создать NFT</h2>
          <input
            type="text"
            placeholder="URI метаданных (например, ipfs://...)"
            className="input input-bordered w-full"
            value={uri}
            onChange={e => setUri(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleMint} disabled={!uri}>
            Mint
          </button>
          {status && <p className="text-sm mt-2 opacity-70">{status}</p>}
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Витрина</h2>
        {!listings || listings.length === 0 ? (
          <p className="text-center opacity-60">Пока нет активных лотов</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((l, i) => (
              <div key={i} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-sm opacity-60">Контракт: {l.nft}</p>
                  <p>Token ID: {l.tokenId.toString()}</p>
                  <p>Цена: {l.price.toString()} wei</p>
                  <p className="flex items-center gap-2">
                    Продавец: <Address address={l.seller} />
                  </p>
                  <button
                    className="btn btn-primary"
                    disabled={!l.active || l.seller === connectedAddress}
                    onClick={() => handleBuy(BigInt(i), l.price)}
                  >
                    {l.active ? "Купить" : "Продано"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
