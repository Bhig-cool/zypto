import fetch from 'node-fetch';

// Map symbols to CoinGecko IDs (extend as needed)
const symbolToId = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
    USDT: 'tether',
    LTC: 'litecoin',
    BCH: 'bitcoin-cash',
    XRP: 'ripple',
    ADA: 'cardano',
    DOT: 'polkadot',
    LINK: 'chainlink',
    BNB: 'binancecoin',
    SOL: 'solana',
    DOGE: 'dogecoin',
    UNI: 'uniswap',
    AVAX: 'avalanche-2',
    MATIC: 'matic-network',

    TRX: 'tron',
    XLM: 'stellar',
    FIL: 'filecoin',
    AAVE: 'aave',
    SUSHI: 'sushi',
    THETA: 'theta',
    ALGO: 'algorand',
    VET: 'vechain',
  // add more coins here...
};

export async function getPrice(symbol) {
  const id = symbolToId[symbol.toUpperCase()];
  if (!id) throw new Error(`Unsupported symbol: ${symbol}`);

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch price from CoinGecko');

  const data = await res.json();
  return data[id]?.usd ?? null;
}
