'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../lib/contract';

export default function VerifyPage() {
  const [inputHash, setInputHash] = useState('');
  const [queryHash, setQueryHash] = useState<`0x${string}` | undefined>(undefined);

  const { data, isLoading, isError, error } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          CONTRACT_ABI,
    functionName: 'verifyReceipt',
    args:         queryHash ? [queryHash] : undefined,
    query:        { enabled: !!queryHash },
  });

  const handleVerify = () => {
    const trimmed = inputHash.trim();
    if (trimmed.startsWith('0x') && trimmed.length === 66) {
      setQueryHash(trimmed as `0x${string}`);
    }
  };

  const formatDate = (timestamp: bigint) =>
    new Date(Number(timestamp) * 1000).toLocaleString();

  const formatEth = (wei: bigint) =>
    (Number(wei) / 1e18).toFixed(6) + ' ETH';

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-mono">
      {/* Header */}
      <header className="border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-black font-bold text-sm">SF</div>
            <span className="text-amber-500 font-bold tracking-widest text-sm uppercase">SchoolFee Tracker</span>
          </div>
          <nav className="flex items-center gap-6 text-xs tracking-widest uppercase">
            <Link href="/"        className="text-zinc-500 hover:text-amber-400 transition-colors">Pay Fees</Link>
            <Link href="/verify"  className="text-amber-500 border-b border-amber-500 pb-0.5">Verify Receipt</Link>
            <Link href="/balance" className="text-zinc-500 hover:text-amber-400 transition-colors">Check Balance</Link>
          </nav>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="text-xs tracking-[0.3em] uppercase text-amber-500/60 mb-3">— On-chain Proof</div>
        <h1 className="text-5xl font-bold tracking-tight leading-none mb-4">
          Verify<br />
          <span className="text-amber-500">Receipt.</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
          Enter a transaction receipt hash to confirm a payment was recorded on-chain.
          Results are fetched directly from the blockchain — no middlemen.
        </p>
      </section>

      {/* Verify form */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Input card */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-xs tracking-widest uppercase text-zinc-500 mb-6">Receipt Hash Lookup</div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-zinc-400 mb-2">
                  Receipt Hash (bytes32)
                </label>
                <textarea
                  value={inputHash}
                  onChange={(e) => { setInputHash(e.target.value); setQueryHash(undefined); }}
                  placeholder="0x1234abcd..."
                  rows={3}
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 px-4 py-3 text-xs text-white outline-none transition-colors placeholder:text-zinc-600 resize-none"
                />
                <p className="text-xs text-zinc-600 mt-1">Must be a 0x-prefixed 66-character hex string</p>
              </div>

              {/* Validation hint */}
              {inputHash && (
                <div className={`text-xs px-3 py-2 border ${
                  inputHash.trim().startsWith('0x') && inputHash.trim().length === 66
                    ? 'border-green-800/40 bg-green-900/10 text-green-400'
                    : 'border-red-800/40 bg-red-900/10 text-red-400'
                }`}>
                  {inputHash.trim().startsWith('0x') && inputHash.trim().length === 66
                    ? '✓ Valid hash format'
                    : `✗ Invalid — need 66 chars, got ${inputHash.trim().length}`}
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={isLoading || !inputHash.trim().startsWith('0x') || inputHash.trim().length !== 66}
                className="w-full bg-amber-500 text-black font-bold text-sm tracking-widest uppercase py-4 hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Querying chain...' : 'Verify →'}
              </button>
            </div>
          </div>

          {/* Result card */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-xs tracking-widest uppercase text-zinc-500 mb-6">Verification Result</div>

            {!queryHash && (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border border-zinc-700 flex items-center justify-center mb-4">
                  <span className="text-zinc-600 text-xl">◈</span>
                </div>
                <p className="text-zinc-600 text-xs tracking-wide">
                  Enter a receipt hash and click<br />Verify to see results
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-48 flex flex-col items-center justify-center">
                <div className="text-xs text-zinc-500 animate-pulse">Querying blockchain...</div>
              </div>
            )}

            {isError && queryHash && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-lg">✗</span>
                  <span className="text-sm font-bold text-red-400">Receipt Not Found</span>
                </div>
                <div className="border border-red-800/40 bg-red-900/10 p-4 text-xs text-red-300 leading-relaxed">
                  No receipt exists for this hash on-chain. This could mean:
                  <ul className="mt-2 space-y-1 list-disc list-inside text-red-400/70">
                    <li>The hash is incorrect</li>
                    <li>The payment was not made through this contract</li>
                    <li>The transaction failed</li>
                  </ul>
                </div>
              </div>
            )}

            {data && !isError && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm font-bold text-green-400">Receipt Verified!</span>
                </div>

                <div className="border border-green-800/40 bg-green-900/10 p-4 space-y-4">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Student ID</div>
                    <div className="text-sm text-white font-bold">{data[0]}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Amount Paid</div>
                    <div className="text-sm text-amber-400 font-bold">{formatEth(data[1])}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Payment Date</div>
                    <div className="text-sm text-white">{formatDate(data[2])}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Receipt Hash</div>
                    <div className="text-xs text-zinc-300 break-all">{queryHash}</div>
                  </div>
                </div>

                <a
                  href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs text-amber-500 hover:text-amber-400 border border-amber-500/30 py-2 transition-colors"
                >
                  View Contract on Etherscan ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
