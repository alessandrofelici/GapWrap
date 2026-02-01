import { useState, useEffect } from 'react';

interface PriceDataPoint {
  timestamp: number;
  price: number;
  change: number; // Percentage change from previous
}

interface SymbolData {
  id: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  priceHistory: PriceDataPoint[];
}

// Mock data generator for development
const MOCK_SYMBOLS: Record<string, SymbolData> = {
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    price: 2450.32,
    change24h: 3.25,
    volume: '$12.5B',
    priceHistory: []
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    price: 43250.75,
    change24h: 1.82,
    volume: '$28.3B',
    priceHistory: []
  },
  USDT: {
    id: 'USDT',
    name: 'Tether',
    price: 1.0002,
    change24h: 0.02,
    volume: '$45.2B',
    priceHistory: []
  },
  USDC: {
    id: 'USDC',
    name: 'USD Coin',
    price: 0.9998,
    change24h: -0.01,
    volume: '$7.8B',
    priceHistory: []
  },
  SOL: {
    id: 'SOL',
    name: 'Solana',
    price: 98.45,
    change24h: 5.67,
    volume: '$2.1B',
    priceHistory: []
  },
  MATIC: {
    id: 'MATIC',
    name: 'Polygon',
    price: 0.8234,
    change24h: -2.34,
    volume: '$450M',
    priceHistory: []
  }
};

// Generate initial price history
Object.keys(MOCK_SYMBOLS).forEach(symbolId => {
  const symbol = MOCK_SYMBOLS[symbolId];
  const history: PriceDataPoint[] = [];
  let currentPrice = symbol.price;
  
  for (let i = 20; i >= 0; i--) {
    const timestamp = Date.now() - i * 60000; // Every minute
    const randomChange = (Math.random() - 0.5) * 2; // -1% to +1%
    currentPrice = currentPrice * (1 + randomChange / 100);
    
    history.push({
      timestamp,
      price: currentPrice,
      change: randomChange
    });
  }
  
  symbol.priceHistory = history;
});

export function usePriceData(selectedSymbol: string) {
  const [symbols, setSymbols] = useState<SymbolData[]>(Object.values(MOCK_SYMBOLS));
  const [currentSymbol, setCurrentSymbol] = useState<SymbolData | null>(null);

  useEffect(() => {
    // Update current symbol when selection changes
    const symbol = symbols.find(s => s.id === selectedSymbol);
    setCurrentSymbol(symbol || null);
  }, [selectedSymbol, symbols]);

  useEffect(() => {
    // Simulate real-time price updates every 3 seconds
    const interval = setInterval(() => {
      setSymbols(prevSymbols => 
        prevSymbols.map(symbol => {
          const randomChange = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
          const newPrice = symbol.price * (1 + randomChange / 100);
          
          // Update price history
          const newDataPoint: PriceDataPoint = {
            timestamp: Date.now(),
            price: newPrice,
            change: randomChange
          };
          
          const updatedHistory = [...symbol.priceHistory.slice(1), newDataPoint];
          
          return {
            ...symbol,
            price: newPrice,
            change24h: symbol.change24h + randomChange * 0.1,
            priceHistory: updatedHistory
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    symbols,
    currentSymbol,
    loading: false,
    error: null
  };
}
