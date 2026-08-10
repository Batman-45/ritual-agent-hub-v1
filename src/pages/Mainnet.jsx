import React, { useState, useEffect } from 'react';
import { getNetworkStatus } from '../services/mainnet';
import { RefreshCw } from 'lucide-react';

const Mainnet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getNetworkStatus();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-zinc-400">Connecting to Ritual Network...</div>;
  if (error) return (
    <div className="p-8 text-center text-red-500">
        Error: {error} 
        <button onClick={loadData} className="block mx-auto mt-4 px-4 py-2 bg-emerald-500 text-black font-semibold rounded-xl">Retry</button>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto text-zinc-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Ritual Network Status</h1>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-700 transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-400 mb-1">Status</p>
            <p className="font-semibold text-emerald-400 text-lg">{data.status.toUpperCase()}</p>
        </div>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-400 mb-1">Chain ID</p>
            <p className="font-semibold text-white text-lg">{data.chainId}</p>
        </div>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-400 mb-1">Latest Block</p>
            <p className="font-semibold text-white text-lg">{data.blockNumber.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-sm text-zinc-400 mb-1">RPC Latency</p>
            <p className="font-semibold text-white text-lg">{data.latency}ms</p>
        </div>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl md:col-span-2">
            <p className="text-sm text-zinc-400 mb-1">Last Updated</p>
            <p className="font-semibold text-white text-lg">{new Date(data.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Mainnet;
