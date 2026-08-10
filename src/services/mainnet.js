const RPC_URL = import.meta.env.VITE_RITUAL_MAINNET_RPC || "https://rpc.ritualfoundation.org";

async function fetchRPC(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1
    })
  });
  
  if (!response.ok) throw new Error(`RPC error: ${response.statusText}`);
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  return data.result;
}

export async function getNetworkStatus() {
  const startTime = Date.now();
  
  const [chainIdHex, blockNumberHex] = await Promise.all([
    fetchRPC("eth_chainId"),
    fetchRPC("eth_blockNumber")
  ]);
  
  const latency = Date.now() - startTime;
  
  const chainId = parseInt(chainIdHex, 16);
  const blockNumber = parseInt(blockNumberHex, 16);
  
  // Get block details for timestamp
  const blockData = await fetchRPC("eth_getBlockByNumber", [blockNumberHex, false]);
  const timestamp = parseInt(blockData.timestamp, 16);

  return {
    chainId,
    blockNumber,
    timestamp: timestamp * 1000,
    latency,
    status: "online"
  };
}
