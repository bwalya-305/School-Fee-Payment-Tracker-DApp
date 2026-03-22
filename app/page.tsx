'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';

export default function PayFeesPage() {
  const { isConnected } = useAccount();
  const [studentId, setStudentId]   = useState('');
  const [amount, setAmount]         = useState('');
  const [receiptHash, setReceiptHash] = useState<string | null>(null);

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handlePay = () => {
    if (!studentId || !amount) return;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'payFee',
        args: [studentId],
        value: parseEther(amount),
      },
      {
        onSuccess: (hash) => {
          setReceiptHash(hash);
        },
      }
    );
  };

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
            <Link href="/"          className="text-amber-500 border-b border-amber-500 pb-0.5">Pay Fees</Link>
            <Link href="/verify"    className="text-zinc-500 hover:text-amber-400 transition-colors">Verify Receipt</Link>
            <Link href="/balance"   className="text-zinc-500 hover:text-amber-400 transition-colors">Check Balance</Link>
            <Link href="/history"   className="text-zinc-500 hover:text-amber-400 transition-colors">Transaction History</Link>
          </nav>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="text-xs tracking-[0.3em] uppercase text-amber-500/60 mb-3">— Blockchain Receipt Proof</div>
        <h1 className="text-5xl font-bold tracking-tight leading-none mb-4">
          Pay School<br />
          <span className="text-amber-500">Fees.</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
          Every payment is recorded on-chain and generates a tamper-proof receipt hash.
          Keep your hash to verify payment at any time.
        </p>
      </section>

      {/* Main form */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form card */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-xs tracking-widest uppercase text-zinc-500 mb-6">Payment Details</div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-zinc-400 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2024-001"
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-zinc-400 mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.05"
                  step="0.001"
                  min="0"
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Summary row */}
              {amount && (
                <div className="border border-zinc-800 bg-black p-4 text-xs space-y-2">
                  <div className="flex justify-between text-zinc-500">
                    <span>Student</span>
                    <span className="text-white">{studentId || '—'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Amount</span>
                    <span className="text-amber-400">{amount} ETH</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Network</span>
                    <span className="text-white">Sepolia Testnet</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="border border-red-800 bg-red-900/20 p-3 text-xs text-red-400">
                  {error.message.slice(0, 120)}...
                </div>
              )}

              {/* Button */}
              {!isConnected ? (
                <div className="text-xs text-zinc-500 text-center py-2">
                  ↑ Connect your wallet to pay fees
                </div>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={isPending || isConfirming || !studentId || !amount}
                  className="w-full bg-amber-500 text-black font-bold text-sm tracking-widest uppercase py-4 hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending    ? 'Waiting for wallet...'  :
                   isConfirming ? 'Confirming on-chain...' :
                   'Pay Now →'}
                </button>
              )}
            </div>
          </div>

          {/* Receipt card */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-8">
            <div className="text-xs tracking-widest uppercase text-zinc-500 mb-6">Receipt</div>

            {!isSuccess && !txHash && (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border border-zinc-700 flex items-center justify-center mb-4">
                  <span className="text-zinc-600 text-xl">◈</span>
                </div>
                <p className="text-zinc-600 text-xs tracking-wide">
                  Your receipt will appear here<br />after a successful payment
                </p>
              </div>
            )}

            {txHash && !isSuccess && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-400">Transaction submitted...</div>
                <div className="border border-zinc-800 bg-black p-3">
                  <div className="text-xs text-zinc-500 mb-1">TX Hash</div>
                  <div className="text-xs text-amber-400 break-all">{txHash}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="animate-pulse">●</span> Waiting for confirmation...
                </div>
              </div>
            )}

            {isSuccess && txHash && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm font-bold text-green-400">Payment Confirmed!</span>
                </div>

                <div className="border border-green-800/40 bg-green-900/10 p-4 space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Student ID</div>
                    <div className="text-sm text-white">{studentId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Amount Paid</div>
                    <div className="text-sm text-amber-400">{amount} ETH</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Transaction Hash</div>
                    <div className="text-xs text-white break-all">{txHash}</div>
                  </div>
                </div>

                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs text-amber-500 hover:text-amber-400 border border-amber-500/30 py-2 transition-colors"
                >
                  View on Etherscan ↗
                </a>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  ⚠ Save your transaction hash above. Use it on the{' '}
                  <Link href="/verify" className="text-amber-500 hover:underline">Verify Receipt</Link>{' '}
                  page to confirm this payment at any time.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
