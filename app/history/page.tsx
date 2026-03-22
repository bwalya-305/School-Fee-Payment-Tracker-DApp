'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../lib/contract';

interface Transaction {
  payer:       string;
  studentId:   string;
  amount:      bigint;
  timestamp:   bigint;
  receiptHash: string;
  txHash:      string;
  blockNumber: bigint;
}

export default function HistoryPage() {
  const [inputId, setInputId]           = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [searched, setSearched]         = useState(false);

  const publicClient = usePublicClient();

  const handleSearch = async () => {
    if (!inputId.trim() || !publicClient) return;

    setIsLoading(true);
    setError(null);
    setSearched(false);
    setTransactions([]);

    try {
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: {
          type:   'event',
          name:   'FeePaid',
          inputs: [
            { name: 'payer',       type: 'address', indexed: true  },
            { name: 'studentId',   type: 'string',  indexed: false },
            { name: 'amount',      type: 'uint256', indexed: false },
            { name: 'timestamp',   type: 'uint256', indexed: false },
            { name: 'receiptHash', type: 'bytes32', indexed: false },
          ],
        },
        fromBlock: "0x9fc019",
        toBlock:   "latest",
      });

      const filtered = logs
        .filter((log) => log.args.studentId === inputId.trim())
        .map((log) => ({
          payer:       log.args.payer       as string,
          studentId:   log.args.studentId   as string,
          amount:      log.args.amount      as bigint,
          timestamp:   log.args.timestamp   as bigint,
          receiptHash: log.args.receiptHash as string,
          txHash:      log.transactionHash,
          blockNumber: log.blockNumber,
        }))
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

      setTransactions(filtered);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatEth = (wei: bigint) =>
    (Number(wei) / 1e18).toFixed(6) + ' ETH';

  const formatDate = (timestamp: bigint) =>
    new Date(Number(timestamp) * 1000).toLocaleString();

  const formatAddress = (addr: string) =>
    addr.slice(0, 6) + '...' + addr.slice(-4);

  const formatHash = (hash: string) =>
    hash.slice(0, 8) + '...' + hash.slice(-6);

  const totalPaid = transactions.reduce((acc, tx) => acc + tx.amount, 0n);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-mono">

      {/* Header */}
      <header className="border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-black font-bold text-sm">SF</div>
            <span className="text-amber-500 font-bold tracking-widest text-sm uppercase">School Fee Payment Tracker</span>
          </div>
          <nav className="flex items-center gap-6 text-xs tracking-widest uppercase">
            <Link href="/"        className="text-zinc-500 hover:text-amber-400 transition-colors">Pay Fees</Link>
            <Link href="/verify"  className="text-zinc-500 hover:text-amber-400 transition-colors">Verify Receipt</Link>
            <Link href="/balance" className="text-zinc-500 hover:text-amber-400 transition-colors">Check Balance</Link>
            <Link href="/history" className="text-amber-500 border-b border-amber-500 pb-0.5">History</Link>
          </nav>
          <ConnectButton showBalance={false} />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="text-xs tracking-[0.3em] uppercase text-amber-500/60 mb-3">On-chain Records</div>
        <h1 className="text-5xl font-bold tracking-tight leading-none mb-4">
          Transaction<br />
          <span className="text-amber-500">History.</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
          View all fee payments recorded on-chain for a student ID.
          Every entry is immutable and publicly verifiable.
        </p>
      </section>

      {/* Search */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter Student ID e.g. STU-2024-001"
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-amber-500 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !inputId.trim()}
            className="bg-amber-500 text-black font-bold text-sm tracking-widest uppercase px-8 py-3 hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? 'Searching...' : 'Search →'}
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        {/* Error */}
        {error && (
          <div className="border border-red-800/40 bg-red-900/10 p-4 text-xs text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <div className="text-xs text-zinc-500 animate-pulse tracking-widest uppercase">
              Scanning blockchain for transactions...
            </div>
          </div>
        )}

        {/* No results */}
        {searched && !isLoading && transactions.length === 0 && (
          <div className="border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <div className="w-12 h-12 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-zinc-600 text-xl">◈</span>
            </div>
            <p className="text-zinc-500 text-sm">No transactions found for <span className="text-white">{inputId}</span></p>
            <p className="text-zinc-600 text-xs mt-2">Make sure the Student ID is exactly correct</p>
          </div>
        )}

        {/* Results table */}
        {transactions.length > 0 && (
          <div className="space-y-4">

            {/* Summary bar */}
            <div className="grid grid-cols-3 border border-zinc-800 bg-zinc-900/50">
              <div className="p-4 border-r border-zinc-800">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Student ID</div>
                <div className="text-sm text-white font-bold">{inputId}</div>
              </div>
              <div className="p-4 border-r border-zinc-800">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Transactions</div>
                <div className="text-sm text-amber-400 font-bold">{transactions.length}</div>
              </div>
              <div className="p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Paid</div>
                <div className="text-sm text-amber-400 font-bold">{formatEth(totalPaid)}</div>
              </div>
            </div>

            {/* Table */}
            <div className="border border-zinc-800 overflow-x-auto">
              <div className="grid grid-cols-6 bg-zinc-900 border-b border-zinc-800 px-4 py-3">
                {['#', 'Date', 'Amount', 'Paid By', 'Receipt Hash', 'Tx'].map((h) => (
                  <div key={h} className="text-xs text-zinc-500 uppercase tracking-widest">{h}</div>
                ))}
              </div>

              {transactions.map((tx, index) => (
                <div
                  key={tx.receiptHash}
                  className="grid grid-cols-6 px-4 py-4 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors items-center"
                >
                  <div className="text-xs text-zinc-500">{transactions.length - index}</div>
                  <div className="text-xs text-zinc-300">{formatDate(tx.timestamp)}</div>
                  <div className="text-xs text-amber-400 font-bold">{formatEth(tx.amount)}</div>
                  <div className="text-xs text-zinc-400 font-mono">{formatAddress(tx.payer)}</div>
                  <div className="text-xs text-zinc-500 font-mono">
                    <button
                      onClick={() => navigator.clipboard.writeText(tx.receiptHash)}
                      title="Click to copy full hash"
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {formatHash(tx.receiptHash)} 📋
                    </button>
                  </div>
                  <div>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-500 hover:text-amber-400 transition-colors border border-amber-500/30 px-2 py-1 hover:border-amber-400"
                    >
                      View ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-600 text-center">
              Click any receipt hash to copy it. Use it on the{' '}
              <Link href="/verify" className="text-amber-500 hover:underline">Verify Receipt</Link>{' '}
              page to confirm payment details.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}