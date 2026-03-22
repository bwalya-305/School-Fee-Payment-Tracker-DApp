'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../lib/contract';

export default function BalancePage() {
  const [inputId, setInputId]   = useState('');
  const [queryId, setQueryId]   = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          CONTRACT_ABI,
    functionName: 'getStudentTotalPaid',
    args:         queryId ? [queryId] : undefined,
    query:        { enabled: !!queryId },
  });

  const handleLookup = () => {
    if (inputId.trim()) setQueryId(inputId.trim());
  };

  const formatEth = (wei: bigint) => {
    const eth = Number(wei) / 1e18;
    return eth === 0 ? '0.000000 ETH' : eth.toFixed(6) + ' ETH';
  };

  const hasPaid = data !== undefined && data > 0n;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-mono">
      {/* Header */}
      <header className="border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-black font-bold text-sm">SF</div>
            <span className="text-amber-500 font-bold tracking-widest text-sm uppercase">School Fee Payment Tracker</span>
          </div>
          <nav className="flex items-center gap-6 text-xs tracking-widest uppercase">
            <Link href="/"        className="text-zinc-500 hover:text-amber-400 transition-colors">Pay Fees</Link>
            <Link href="/verify"  className="text-zinc-500 hover:text-amber-400 transition-colors">Verify Receipt</Link>
            <Link href="/balance" className="text-amber-500 border-b border-amber-500 pb-0.5">Check Balance</Link>
            <Link href="/history"  className="text-zinc-500 hover:text-amber-400 transition-colors">Transaction History</Link>
          </nav>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="text-xs tracking-[0.3em] uppercase text-amber-500/60 mb-3">— Fee Records</div>
        <h1 className="text-5xl font-bold tracking-tight leading-none mb-4">
          Check<br />
          <span className="text-amber-500">Balance.</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
          Look up the total fees paid by any student ID.
          All data is read directly from the blockchain in real-time and trustless.
        </p>
      </section>

      {/* Lookup form */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Input card */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-xs tracking-widest uppercase text-zinc-500 mb-6">Student Lookup</div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-zinc-400 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => { setInputId(e.target.value); setQueryId(undefined); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="e.g. STU-2024-001"
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <button
                onClick={handleLookup}
                disabled={isLoading || !inputId.trim()}
                className="w-full bg-amber-500 text-black font-bold text-sm tracking-widest uppercase py-4 hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Looking up...' : 'Lookup →'}
              </button>

              {/* Info note */}
              <div className="border border-zinc-800 bg-black p-4 text-xs text-zinc-500 leading-relaxed space-y-1">
                <div className="text-zinc-400 font-bold mb-2">ℹ How it works</div>
                <p>The balance shown is the total cumulative amount paid on-chain for this student ID.</p>
                <p className="mt-1">This is a public read — no wallet connection required.</p>
              </div>
            </div>
          </div>

          {/* Result card */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-xs tracking-widest uppercase text-zinc-500 mb-6">Balance Result</div>

            {!queryId && (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border border-zinc-700 flex items-center justify-center mb-4">
                  <span className="text-zinc-600 text-xl">◈</span>
                </div>
                <p className="text-zinc-600 text-xs tracking-wide">
                  Enter a student ID and click<br />Lookup to see their balance
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-48 flex flex-col items-center justify-center">
                <div className="text-xs text-zinc-500 animate-pulse">Reading from blockchain...</div>
              </div>
            )}

            {isError && queryId && (
              <div className="border border-red-800/40 bg-red-900/10 p-4 text-xs text-red-400">
                Error reading from contract. Check your connection and try again.
              </div>
            )}

            {data !== undefined && !isError && queryId && (
              <div className="space-y-6">

                {/* Big balance display */}
                <div className="border border-zinc-800 bg-black p-6 text-center">
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Total Fees Paid</div>
                  <div className={`text-3xl font-bold ${hasPaid ? 'text-amber-400' : 'text-zinc-600'}`}>
                    {formatEth(data)}
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 ${
                      hasPaid
                        ? 'bg-green-900/30 text-green-400 border border-green-800/40'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {hasPaid ? '● Active — fees recorded' : '● No fees recorded'}
                    </span>
                  </div>
                </div>

                {/* Student details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 uppercase tracking-widest">Student ID</span>
                    <span className="text-white font-bold">{queryId}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 uppercase tracking-widest">Network</span>
                    <span className="text-white">Sepolia Testnet</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 uppercase tracking-widest">Status</span>
                    <span className={hasPaid ? 'text-green-400' : 'text-zinc-500'}>
                      {hasPaid ? 'Fees Paid' : 'No Record'}
                    </span>
                  </div>
                </div>

                {hasPaid && (
                  <Link
                    href="/"
                    className="block text-center text-xs text-amber-500 hover:text-amber-400 border border-amber-500/30 py-2 transition-colors"
                  >
                    Make Another Payment →
                  </Link>
                )}

                {!hasPaid && (
                  <Link
                    href="/"
                    className="block text-center text-xs bg-amber-500 text-black font-bold py-2 hover:bg-amber-400 transition-colors"
                  >
                    Pay Fees Now →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
